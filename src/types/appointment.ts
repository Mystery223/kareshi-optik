import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { appointments, appointmentSlots } from '@/lib/db/schema';
import { ServiceType } from './index';

export type Appointment = InferSelectModel<typeof appointments>;
export type NewAppointment = InferInsertModel<typeof appointments>;

export type AppointmentSlot = InferSelectModel<typeof appointmentSlots>;
export type NewAppointmentSlot = InferInsertModel<typeof appointmentSlots>;

export interface AppointmentWithDetails extends Appointment {
    optometrist: {
        id: string;
        name: string;
    } | null;
}

export interface CreateAppointmentInput {
    customerId?: string;
    guestName?: string;
    guestPhone?: string;
    guestEmail?: string;
    optometristId?: string;
    appointmentDate: string;
    appointmentTime: string;
    serviceType: ServiceType;
    notes?: string;
}
