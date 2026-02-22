import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { customers, eyeExamHistory } from '@/lib/db/schema';

export type Customer = InferSelectModel<typeof customers>;
export type NewCustomer = InferInsertModel<typeof customers>;

export type EyeExamHistory = InferSelectModel<typeof eyeExamHistory>;
export type NewEyeExamHistory = InferInsertModel<typeof eyeExamHistory>;

export interface EyePrescription {
    sph: number | null;
    cyl: number | null;
    axis: number | null;
    add: number | null;
}

export interface CustomerWithExams extends Customer {
    exams: EyeExamHistory[];
}
