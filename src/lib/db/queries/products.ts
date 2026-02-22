import { db } from '@/lib/db';
import { products, brands, categories, productVariants, reviews } from '@/lib/db/schema';
import { eq, and, gte, lte, or, ilike, sql, desc, asc, type SQL } from 'drizzle-orm';
import { buildCacheKey, getCachedJson, setCachedJson } from '@/lib/cache/redis';

export interface GetProductsFilters {
    category?: string;
    brand?: string;
    gender?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}

type ProductListItem = typeof products.$inferSelect & {
    brand: typeof brands.$inferSelect | null;
    category: typeof categories.$inferSelect | null;
    variants: typeof productVariants.$inferSelect[];
};

type ProductListResult = {
    items: ProductListItem[];
    metadata: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

type ProductDetailResult = (typeof products.$inferSelect & {
    brand: typeof brands.$inferSelect | null;
    category: typeof categories.$inferSelect | null;
    variants: typeof productVariants.$inferSelect[];
    reviews: typeof reviews.$inferSelect[];
}) | undefined;

function stableStringify(value: unknown): string {
    if (value === null || typeof value !== "object") {
        return JSON.stringify(value) ?? "null";
    }

    if (Array.isArray(value)) {
        return `[${value.map((item) => stableStringify(item)).join(",")}]`;
    }

    const entries = Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, val]) => `"${key}":${stableStringify(val)}`);

    return `{${entries.join(",")}}`;
}

export async function getProducts(filters: GetProductsFilters = {}, page = 1, limit = 12) {
    const cacheKey = buildCacheKey("products", "list", stableStringify({ filters, page, limit }));
    const cached = await getCachedJson<ProductListResult>(cacheKey);
    if (cached) return cached;

    const offset = (page - 1) * limit;
    const whereClauses: SQL[] = [eq(products.isActive, true)];

    if (filters.category) {
        // Sub-select for category ID if slug is provided
        const categorySubgroup = db.select({ id: categories.id }).from(categories).where(eq(categories.slug, filters.category)).as('cat_sub');
        whereClauses.push(sql`${products.categoryId} IN (SELECT id FROM ${categorySubgroup})`);
    }

    if (filters.brand) {
        const brandSubgroup = db.select({ id: brands.id }).from(brands).where(eq(brands.slug, filters.brand)).as('brand_sub');
        whereClauses.push(sql`${products.brandId} IN (SELECT id FROM ${brandSubgroup})`);
    }

    if (filters.gender) {
        whereClauses.push(eq(products.gender, filters.gender));
    }

    if (filters.minPrice !== undefined) {
        whereClauses.push(gte(products.price, filters.minPrice.toString()));
    }

    if (filters.maxPrice !== undefined) {
        whereClauses.push(lte(products.price, filters.maxPrice.toString()));
    }

    if (filters.search) {
        const searchVector = sql`to_tsvector('indonesian', ${products.name} || ' ' || ${products.description})`;
        const searchQuery = sql`plainto_tsquery('indonesian', ${filters.search})`;

        whereClauses.push(
            or(
                sql`${searchVector} @@ ${searchQuery}`,
                ilike(products.sku, `%${filters.search}%`)
            ) as SQL
        );
    }

    let orderBy = desc(products.createdAt);
    if (filters.sort === 'price-asc') orderBy = asc(products.price);
    if (filters.sort === 'price-desc') orderBy = desc(products.price);
    if (filters.sort === 'popular') orderBy = desc(products.itemSold);

    const data = await db.query.products.findMany({
        where: and(...whereClauses),
        limit,
        offset,
        orderBy,
        with: {
            brand: true,
            category: true,
            variants: {
                where: eq(productVariants.isActive, true)
            }
        }
    });

    const totalCountResult = await db.select({ count: sql<number>`count(*)` })
        .from(products)
        .where(and(...whereClauses));

    const total = Number(totalCountResult[0]?.count ?? 0);

    const payload: ProductListResult = {
        items: data,
        metadata: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
    await setCachedJson(cacheKey, payload);
    return payload;
}

export async function getProductBySlug(slug: string): Promise<ProductDetailResult> {
    const cacheKey = buildCacheKey("products", "detail", slug);
    const cached = await getCachedJson<ProductDetailResult>(cacheKey);
    if (cached) return cached;

    const [product] = await db
        .select()
        .from(products)
        .where(and(eq(products.slug, slug), eq(products.isActive, true)))
        .limit(1);

    if (!product) return undefined;

    const [brandData] = product.brandId
        ? await db.select().from(brands).where(eq(brands.id, product.brandId)).limit(1)
        : [null];

    const [categoryData] = product.categoryId
        ? await db.select().from(categories).where(eq(categories.id, product.categoryId)).limit(1)
        : [null];

    const variantsData = await db
        .select()
        .from(productVariants)
        .where(and(eq(productVariants.productId, product.id), eq(productVariants.isActive, true)))
        .orderBy(desc(productVariants.createdAt));

    let reviewsData: typeof reviews.$inferSelect[] = [];
    try {
        reviewsData = await db
            .select()
            .from(reviews)
            .where(and(eq(reviews.productId, product.id), eq(reviews.isPublished, true)))
            .orderBy(desc(reviews.createdAt));
    } catch (error) {
        console.error("[GET_PRODUCT_BY_SLUG_REVIEWS_QUERY]", error);
    }

    const payload: ProductDetailResult = {
        ...product,
        brand: brandData,
        category: categoryData,
        variants: variantsData,
        reviews: reviewsData,
    };
    await setCachedJson(cacheKey, payload);
    return payload;
}

export async function getFeaturedProducts(limit = 4) {
    const cacheKey = buildCacheKey("products", "featured", limit);
    const cached = await getCachedJson<Awaited<ReturnType<typeof db.query.products.findMany>>>(cacheKey);
    if (cached) return cached;

    const payload = await db.query.products.findMany({
        where: eq(products.isActive, true),
        limit,
        orderBy: desc(products.rating),
        with: {
            brand: true,
            category: true
        }
    });
    await setCachedJson(cacheKey, payload);
    return payload;
}

export async function getRelatedProducts(productId: string, categoryId: string | null, limit = 4) {
    const cacheKey = buildCacheKey("products", "related", productId, categoryId || "none", limit);
    const cached = await getCachedJson<Awaited<ReturnType<typeof db.query.products.findMany>>>(cacheKey);
    if (cached) return cached;

    const whereClauses: SQL[] = [
        eq(products.isActive, true),
        sql`${products.id} != ${productId}`
    ];

    if (categoryId) {
        whereClauses.push(eq(products.categoryId, categoryId));
    }

    const payload = await db.query.products.findMany({
        where: and(...whereClauses),
        limit,
        orderBy: desc(products.itemSold),
        with: {
            brand: true,
            category: true
        }
    });
    await setCachedJson(cacheKey, payload);
    return payload;
}
