import { z } from 'zod';

export const appointmentSchema = z.object({
    customerId: z.string().uuid().optional(),
    customerName: z.string().min(2, 'Nama minimal 2 karakter'),
    phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
    email: z.string().email('Email tidak valid').optional().or(z.literal('')),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
    time: z.string().min(1, 'Pilih waktu janji temu'),
    optometristId: z.string().uuid().optional().or(z.literal('')),
    serviceType: z.string().min(1, 'Pilih jenis layanan'),
    notes: z.string().max(500, 'Catatan maksimal 500 karakter').optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
