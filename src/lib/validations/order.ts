import { z } from 'zod';

export const orderSchema = z.object({
    customerId: z.string().uuid().optional(),
    productVariantId: z.string().uuid('Pilih varian produk'),
    lensId: z.string().uuid().optional(),
    paymentMethod: z.string().min(1, 'Pilih metode pembayaran'),
    notes: z.string().optional(),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
