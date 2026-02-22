import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { orders } from '@/lib/db/schema';

export type Order = InferSelectModel<typeof orders>;
export type NewOrder = InferInsertModel<typeof orders>;

export interface OrderWithDetails extends Order {
    customer: {
        firstName: string;
        lastName: string | null;
    } | null;
    product: {
        name: string;
    } | null;
    variant: {
        colorName: string | null;
    } | null;
}
