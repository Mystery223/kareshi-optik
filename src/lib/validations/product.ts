import { z } from 'zod';

export const productSchema = z.object({
    sku: z.string().min(3, 'SKU minimal 3 karakter'),
    name: z.string().min(3, 'Nama minimal 3 karakter'),
    slug: z.string().min(3, 'Slug minimal 3 karakter'),
    brandId: z.string().uuid('Pilih brand'),
    categoryId: z.string().uuid('Pilih kategori').optional(),
    gender: z.enum(['pria', 'wanita', 'unisex', 'anak']),
    material: z.string().optional(),
    shape: z.string().optional(),
    price: z.string().or(z.number()).transform((val) => Number(val)),
    description: z.string().optional(),
});

export const variantSchema = z.object({
    productId: z.string().uuid(),
    colorName: z.string().min(1, 'Nama warna harus diisi'),
    colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Format Hex tidak valid'),
    stock: z.number().int().min(0),
    skuVariant: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
export type VariantFormValues = z.infer<typeof variantSchema>;
