import { z } from 'zod';

export const customerSchema = z.object({
    firstName: z.string().min(2, 'Nama depan minimal 2 karakter'),
    lastName: z.string().optional(),
    email: z.string().email('Email tidak valid').optional().or(z.literal('')),
    phone: z.string().min(10, 'Nomor telepon minimal 10 digit').optional().or(z.literal('')),
    gender: z.string().optional(),
    address: z.string().optional(),
});

export const eyePrescriptionSchema = z.object({
    sphere: z.number().nullable(),
    cylinder: z.number().nullable(),
    axis: z.number().int().min(0).max(180).nullable(),
    add: z.number().nullable(),
});

export const medicalRecordSchema = z.object({
    customerId: z.string().uuid(),
    re: eyePrescriptionSchema, // Right Eye (OD)
    le: eyePrescriptionSchema, // Left Eye (OS)
    pd: z.number().min(0).nullable(),
    notes: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
export type MedicalRecordFormValues = z.infer<typeof medicalRecordSchema>;
