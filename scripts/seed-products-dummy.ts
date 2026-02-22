import dotenv from "dotenv";
import { and, eq } from "drizzle-orm";
import {
  brands,
  categories,
  productVariants,
  products,
  reviews,
} from "../src/lib/db/schema";

async function getDb() {
  const mod = await import("../src/lib/db");
  return mod.db;
}

type Db = Awaited<ReturnType<typeof getDb>>;
type BrandInsert = typeof brands.$inferInsert;
type CategoryInsert = typeof categories.$inferInsert;
type ProductInsert = typeof products.$inferInsert;
type ProductSeed = {
  sku: string;
  name: string;
  slug: string;
  brandSlug: string;
  categorySlug: string;
  gender: string;
  material: string;
  shape: string;
  dimension: string;
  price: string;
  originalPrice?: string;
  description: string;
  variants: Array<{
    colorName: string;
    colorHex: string;
    stock: number;
    skuVariant: string;
  }>;
};

const BRAND_IMAGE_MAP: Record<string, string> = {
  "ray-ban": "/images/products/brands/ray-ban.svg",
  oakley: "/images/products/brands/oakley.svg",
  gucci: "/images/products/brands/gucci.svg",
  "tom-ford": "/images/products/brands/tom-ford.svg",
  "oliver-peoples": "/images/products/brands/oliver-peoples.svg",
};

const BRAND_SEEDS: BrandInsert[] = [
  {
    name: "Ray-Ban",
    slug: "ray-ban",
    country: "Italy",
    description: "Timeless frames for everyday style.",
    isActive: true,
  },
  {
    name: "Oakley",
    slug: "oakley",
    country: "USA",
    description: "Performance eyewear with bold silhouette.",
    isActive: true,
  },
  {
    name: "Gucci",
    slug: "gucci",
    country: "Italy",
    description: "Luxury frames with fashion-forward details.",
    isActive: true,
  },
  {
    name: "Tom Ford",
    slug: "tom-ford",
    country: "USA",
    description: "Contemporary premium eyewear collection.",
    isActive: true,
  },
  {
    name: "Oliver Peoples",
    slug: "oliver-peoples",
    country: "USA",
    description: "Handcrafted vintage-inspired eyewear.",
    isActive: true,
  },
];

const CATEGORY_SEEDS: CategoryInsert[] = [
  { name: "Kacamata Pria", slug: "pria", isActive: true },
  { name: "Kacamata Wanita", slug: "wanita", isActive: true },
  { name: "Kacamata Anak", slug: "anak", isActive: true },
  { name: "Sunglasses", slug: "sunglasses", isActive: true },
  { name: "Sport", slug: "sport", isActive: true },
];

const PRODUCT_SEEDS: ProductSeed[] = [
  {
    sku: "RB-CLBM-01",
    name: "Ray-Ban Clubmaster Heritage",
    slug: "ray-ban-clubmaster-heritage",
    brandSlug: "ray-ban",
    categorySlug: "pria",
    gender: "pria",
    material: "Acetate & Metal",
    shape: "kotak",
    dimension: "51-21-145",
    price: "2150000",
    originalPrice: "2490000",
    description: "Frame klasik Ray-Ban dengan nuansa retro modern.",
    variants: [
      { colorName: "Black Gold", colorHex: "#1f1f1f", stock: 8, skuVariant: "RB-CLBM-01-BKGD" },
      { colorName: "Tortoise Gold", colorHex: "#5a3d2b", stock: 6, skuVariant: "RB-CLBM-01-TRGD" },
    ],
  },
  {
    sku: "RB-AVI-02",
    name: "Ray-Ban Aviator Luxe",
    slug: "ray-ban-aviator-luxe",
    brandSlug: "ray-ban",
    categorySlug: "sunglasses",
    gender: "unisex",
    material: "Metal",
    shape: "aviator",
    dimension: "58-14-140",
    price: "2390000",
    description: "Aviator ikonik dengan perlindungan UV maksimal.",
    variants: [
      { colorName: "Gold Green", colorHex: "#b9933f", stock: 7, skuVariant: "RB-AVI-02-GDGR" },
      { colorName: "Silver Blue", colorHex: "#9fa5ab", stock: 4, skuVariant: "RB-AVI-02-SLBL" },
    ],
  },
  {
    sku: "RB-MTR-03",
    name: "Ray-Ban Metro Titanium",
    slug: "ray-ban-metro-titanium",
    brandSlug: "ray-ban",
    categorySlug: "pria",
    gender: "pria",
    material: "Titanium",
    shape: "geometric",
    dimension: "53-17-142",
    price: "2690000",
    description: "Model urban ringan dengan garis frame modern.",
    variants: [
      { colorName: "Matte Navy", colorHex: "#2f3b52", stock: 5, skuVariant: "RB-MTR-03-MTNV" },
      { colorName: "Graphite", colorHex: "#4e5459", stock: 5, skuVariant: "RB-MTR-03-GRPH" },
    ],
  },
  {
    sku: "OK-HLF-01",
    name: "Oakley Half Jacket Pro",
    slug: "oakley-half-jacket-pro",
    brandSlug: "oakley",
    categorySlug: "sport",
    gender: "pria",
    material: "O-Matter",
    shape: "oval",
    dimension: "62-12-135",
    price: "2890000",
    description: "Kacamata sport performa tinggi untuk aktivitas outdoor.",
    variants: [
      { colorName: "Matte Black", colorHex: "#212121", stock: 9, skuVariant: "OK-HLF-01-MTBK" },
      { colorName: "Steel Grey", colorHex: "#5d646b", stock: 5, skuVariant: "OK-HLF-01-STGY" },
    ],
  },
  {
    sku: "OK-MTR-02",
    name: "Oakley Metro Line",
    slug: "oakley-metro-line",
    brandSlug: "oakley",
    categorySlug: "pria",
    gender: "pria",
    material: "Titanium",
    shape: "kotak",
    dimension: "53-18-142",
    price: "2590000",
    description: "Frame harian dengan desain tegas dan ringan.",
    variants: [
      { colorName: "Graphite", colorHex: "#4f5357", stock: 6, skuVariant: "OK-MTR-02-GRPH" },
      { colorName: "Onyx", colorHex: "#1b1b1d", stock: 5, skuVariant: "OK-MTR-02-ONYX" },
    ],
  },
  {
    sku: "OK-ACT-03",
    name: "Oakley Active Shield",
    slug: "oakley-active-shield",
    brandSlug: "oakley",
    categorySlug: "sport",
    gender: "unisex",
    material: "O-Matter",
    shape: "oversized",
    dimension: "60-13-138",
    price: "2990000",
    description: "Frame sport high-coverage untuk aktivitas intens.",
    variants: [
      { colorName: "Carbon", colorHex: "#2a2d31", stock: 6, skuVariant: "OK-ACT-03-CRBN" },
      { colorName: "Ice Blue", colorHex: "#7da1bd", stock: 4, skuVariant: "OK-ACT-03-ICBL" },
    ],
  },
  {
    sku: "GC-EDT-01",
    name: "Gucci Editorial Cat-Eye",
    slug: "gucci-editorial-cat-eye",
    brandSlug: "gucci",
    categorySlug: "wanita",
    gender: "wanita",
    material: "Acetate",
    shape: "cat_eye",
    dimension: "54-17-140",
    price: "4250000",
    originalPrice: "4590000",
    description: "Desain cat-eye premium dengan detail khas Gucci.",
    variants: [
      { colorName: "Bordeaux", colorHex: "#5b2732", stock: 3, skuVariant: "GC-EDT-01-BDRX" },
      { colorName: "Ivory", colorHex: "#f0e7d7", stock: 2, skuVariant: "GC-EDT-01-IVRY" },
    ],
  },
  {
    sku: "GC-GLM-02",
    name: "Gucci Glam Oversized",
    slug: "gucci-glam-oversized",
    brandSlug: "gucci",
    categorySlug: "sunglasses",
    gender: "wanita",
    material: "Acetate",
    shape: "oversized",
    dimension: "56-19-145",
    price: "4490000",
    description: "Oversized frame untuk tampilan fashion statement.",
    variants: [
      { colorName: "Black", colorHex: "#191919", stock: 4, skuVariant: "GC-GLM-02-BLCK" },
      { colorName: "Champagne", colorHex: "#d6c2a0", stock: 2, skuVariant: "GC-GLM-02-CHMP" },
    ],
  },
  {
    sku: "GC-CLS-03",
    name: "Gucci Classique Line",
    slug: "gucci-classique-line",
    brandSlug: "gucci",
    categorySlug: "wanita",
    gender: "wanita",
    material: "Acetate & Metal",
    shape: "oval",
    dimension: "52-18-142",
    price: "4090000",
    description: "Siluet klasik mewah dengan detail finishing premium.",
    variants: [
      { colorName: "Emerald", colorHex: "#2f5b52", stock: 3, skuVariant: "GC-CLS-03-EMRD" },
      { colorName: "Rose Taupe", colorHex: "#9a7c79", stock: 3, skuVariant: "GC-CLS-03-RSTP" },
    ],
  },
  {
    sku: "TF-MDN-01",
    name: "Tom Ford Modern Square",
    slug: "tom-ford-modern-square",
    brandSlug: "tom-ford",
    categorySlug: "pria",
    gender: "pria",
    material: "Acetate",
    shape: "kotak",
    dimension: "52-19-145",
    price: "3890000",
    description: "Model signature Tom Ford untuk profesional modern.",
    variants: [
      { colorName: "Noir", colorHex: "#111111", stock: 6, skuVariant: "TF-MDN-01-NOIR" },
      { colorName: "Brown Horn", colorHex: "#5d4637", stock: 4, skuVariant: "TF-MDN-01-BRHR" },
    ],
  },
  {
    sku: "TF-EVG-02",
    name: "Tom Ford Evergreen",
    slug: "tom-ford-evergreen",
    brandSlug: "tom-ford",
    categorySlug: "wanita",
    gender: "wanita",
    material: "Titanium",
    shape: "oval",
    dimension: "50-18-140",
    price: "3650000",
    description: "Frame ringan dengan sentuhan elegant minimalis.",
    variants: [
      { colorName: "Rose Gold", colorHex: "#b4877c", stock: 5, skuVariant: "TF-EVG-02-RSGD" },
      { colorName: "Gunmetal", colorHex: "#4f5458", stock: 3, skuVariant: "TF-EVG-02-GNMT" },
    ],
  },
  {
    sku: "TF-PRM-03",
    name: "Tom Ford Premiere Edge",
    slug: "tom-ford-premiere-edge",
    brandSlug: "tom-ford",
    categorySlug: "pria",
    gender: "pria",
    material: "Acetate",
    shape: "kotak",
    dimension: "54-18-145",
    price: "3990000",
    description: "Frame premium dengan karakter bold dan refined.",
    variants: [
      { colorName: "Dark Havana", colorHex: "#4a372b", stock: 4, skuVariant: "TF-PRM-03-DHVN" },
      { colorName: "Jet Black", colorHex: "#121212", stock: 4, skuVariant: "TF-PRM-03-JTBK" },
    ],
  },
  {
    sku: "OP-VTG-01",
    name: "Oliver Peoples Vintage Round",
    slug: "oliver-peoples-vintage-round",
    brandSlug: "oliver-peoples",
    categorySlug: "sunglasses",
    gender: "unisex",
    material: "Acetate",
    shape: "bulat",
    dimension: "49-20-145",
    price: "3490000",
    description: "Nuansa vintage klasik dengan kenyamanan premium.",
    variants: [
      { colorName: "Amber", colorHex: "#8a6238", stock: 5, skuVariant: "OP-VTG-01-AMBR" },
      { colorName: "Matte Black", colorHex: "#1d1d1f", stock: 5, skuVariant: "OP-VTG-01-MTBK" },
    ],
  },
  {
    sku: "OP-CRT-02",
    name: "Oliver Peoples Crafted Slim",
    slug: "oliver-peoples-crafted-slim",
    brandSlug: "oliver-peoples",
    categorySlug: "pria",
    gender: "pria",
    material: "Titanium",
    shape: "geometric",
    dimension: "51-19-145",
    price: "3590000",
    description: "Handcrafted slim frame untuk look refined.",
    variants: [
      { colorName: "Smoke Grey", colorHex: "#646a70", stock: 4, skuVariant: "OP-CRT-02-SMGY" },
      { colorName: "Bronze", colorHex: "#7a5a3d", stock: 3, skuVariant: "OP-CRT-02-BRNZ" },
    ],
  },
  {
    sku: "OP-SGN-03",
    name: "Oliver Peoples Signature Thin",
    slug: "oliver-peoples-signature-thin",
    brandSlug: "oliver-peoples",
    categorySlug: "sunglasses",
    gender: "unisex",
    material: "Titanium",
    shape: "oval",
    dimension: "50-20-146",
    price: "3690000",
    description: "Frame tipis handcrafted dengan nuansa timeless.",
    variants: [
      { colorName: "Vintage Gold", colorHex: "#9e855d", stock: 4, skuVariant: "OP-SGN-03-VTGD" },
      { colorName: "Matte Olive", colorHex: "#5b6650", stock: 4, skuVariant: "OP-SGN-03-MTOL" },
    ],
  },
] as const;

async function upsertBrands(db: Db) {
  for (const brand of BRAND_SEEDS) {
    const [existing] = await db.select().from(brands).where(eq(brands.slug, brand.slug!)).limit(1);
    if (existing) {
      await db
        .update(brands)
        .set({
          name: brand.name,
          country: brand.country ?? null,
          description: brand.description ?? null,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(brands.id, existing.id));
      continue;
    }

    await db.insert(brands).values(brand);
  }
}

async function upsertCategories(db: Db) {
  for (const category of CATEGORY_SEEDS) {
    const [existing] = await db.select().from(categories).where(eq(categories.slug, category.slug!)).limit(1);
    if (existing) continue;
    await db.insert(categories).values(category);
  }
}

async function seedProducts(db: Db) {
  for (const seed of PRODUCT_SEEDS) {
    const [brand] = await db.select().from(brands).where(eq(brands.slug, seed.brandSlug)).limit(1);
    if (!brand) continue;

    const [category] = await db.select().from(categories).where(eq(categories.slug, seed.categorySlug)).limit(1);
    const thumbnail = BRAND_IMAGE_MAP[seed.brandSlug] || "/images/products/brands/default.svg";

    const productPayload: ProductInsert = {
      sku: seed.sku,
      name: seed.name,
      slug: seed.slug,
      brandId: brand.id,
      categoryId: category?.id ?? null,
      gender: seed.gender,
      material: seed.material,
      shape: seed.shape,
      dimension: seed.dimension,
      price: seed.price,
      originalPrice: seed.originalPrice ?? null,
      description: seed.description,
      thumbnailUrl: thumbnail,
      images: [thumbnail],
      isActive: true,
    };

    const [existingProduct] = await db.select().from(products).where(eq(products.slug, seed.slug)).limit(1);

    let productId = "";
    if (existingProduct) {
      const [updated] = await db
        .update(products)
        .set({
          ...productPayload,
          updatedAt: new Date(),
        })
        .where(eq(products.id, existingProduct.id))
        .returning();
      productId = updated.id;
    } else {
      const [inserted] = await db.insert(products).values(productPayload).returning();
      productId = inserted.id;
    }

    for (const variant of seed.variants) {
      const [existingVariant] = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.skuVariant, variant.skuVariant))
        .limit(1);

      if (existingVariant) {
        await db
          .update(productVariants)
          .set({
            productId,
            colorName: variant.colorName,
            colorHex: variant.colorHex,
            stock: variant.stock,
            isActive: true,
          })
          .where(eq(productVariants.id, existingVariant.id));
      } else {
        await db.insert(productVariants).values({
          productId,
          colorName: variant.colorName,
          colorHex: variant.colorHex,
          stock: variant.stock,
          skuVariant: variant.skuVariant,
          isActive: true,
        });
      }
    }

    const [existingReview] = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.customerName, "Kareshi Reviewer")))
      .limit(1);

    if (!existingReview) {
      await db.insert(reviews).values({
        productId,
        customerName: "Kareshi Reviewer",
        rating: 5,
        comment: `Produk ${seed.name} nyaman dipakai dan kualitas frame sangat baik.`,
        isVerified: true,
        isPublished: true,
      });
    }
  }
}

async function main() {
  dotenv.config({ path: ".env.local" });
  dotenv.config();
  const db = await getDb();

  await upsertBrands(db);
  await upsertCategories(db);
  await seedProducts(db);

  console.log("Dummy product seed completed.");
  console.log("Brands: Ray-Ban, Oakley, Gucci, Tom Ford, Oliver Peoples");
  console.log("Products seeded/updated:", PRODUCT_SEEDS.length);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed to seed dummy products:", err);
    process.exit(1);
  });
