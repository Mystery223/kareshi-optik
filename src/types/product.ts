import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { products, productVariants, brands, categories } from '@/lib/db/schema';

export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;

export type ProductVariant = InferSelectModel<typeof productVariants>;
export type NewProductVariant = InferInsertModel<typeof productVariants>;

export type Brand = InferSelectModel<typeof brands>;
export type Category = InferSelectModel<typeof categories>;

export interface ProductWithBrand extends Product {
    brand: Brand | null;
    category: Category | null;
    variants?: ProductVariant[];
}

export interface ProductFilters {
    gender?: string;
    brand?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
    q?: string;
    page?: number;
    limit?: number;
}
