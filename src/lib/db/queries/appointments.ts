import { db } from '@/lib/db';
import {
    appointments,
    appointmentSlots,
    optometrists,
    customers,
    eyeExamHistory
} from '@/lib/db/schema';
import { eq, and, sql, notInArray } from 'drizzle-orm';
import { generateBookingCode } from '@/lib/utils/booking-code';

/**
 * Mengambil slot yang tersedia pada tanggal tertentu.
 * Logika: Cari slot default (misal Senin) atau slot khusus tanggal tersebut,
 * lalu filter yang jumlah appointment-nya belum mencapai maxPatients.
 */
export async function getAvailableSlots(dateStr: string) {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday...

    // 1. Ambil semua slot yang mungkin untuk hari tersebut (default atau spesifik tanggal)
    const potentialSlots = await db.select().from(appointmentSlots).where(
        and(
            eq(appointmentSlots.isAvailable, true),
            sql`(${appointmentSlots.dayOfWeek} = ${dayOfWeek} OR ${appointmentSlots.date} = ${dateStr})`
        )
    );

    // 2. Hitung jumlah janji temu yang sudah ada untuk setiap slot di tanggal tersebut
    const existingAppointments = await db
        .select({
            count: sql<number>`count(*)`,
            appointmentTime: appointments.appointmentTime
        })
        .from(appointments)
        .where(and(
            eq(appointments.appointmentDate, dateStr),
            notInArray(appointments.status, ['cancelled'])
        ))
        .groupBy(appointments.appointmentTime);

    // 3. Gabungkan data untuk menentukan ketersediaan riil
    return potentialSlots.map(slot => {
        const usage = existingAppointments.find(a => a.appointmentTime === slot.startTime);
        const currentCount = Number(usage?.count ?? 0);
        return {
            ...slot,
            currentCount,
            isFullyBooked: currentCount >= slot.maxPatients
        };
    });
}

export async function getOptometrists() {
    return await db.select().from(optometrists).where(eq(optometrists.isActive, true));
}

export interface BookingData {
    customerName: string;
    phone: string;
    email?: string;
    optometristId?: string;
    appointmentDate: string;
    appointmentTime: string;
    serviceType: string;
    notes?: string;
    customerId?: string; // If already logged in
}

/**
 * Memproses booking janji temu secara transactional.
 */
export async function createAppointment(data: BookingData) {
    return await db.transaction(async (tx) => {
        let customerId = data.customerId;

        // 1. Jika guest, buat entry customer baru atau cari yang sudah ada berdasarkan phone/email
        if (!customerId) {
            const existingCustomer = await tx.query.customers.findFirst({
                where: sql`phone = ${data.phone} OR (email = ${data.email} AND email IS NOT NULL)`
            });

            if (existingCustomer) {
                customerId = existingCustomer.id;
            } else {
                // Split name consistently
                const names = data.customerName.trim().split(/\s+/);
                const firstName = names[0];
                const lastName = names.slice(1).join(" ") || null;

                const [newCustomer] = await tx.insert(customers).values({
                    firstName,
                    lastName,
                    phone: data.phone,
                    email: data.email,
                }).returning();
                customerId = newCustomer.id;
            }
        }

        // 2. Generate booking code
        const bookingCode = generateBookingCode();

        // 3. Simpan appointment
        const [appointment] = await tx.insert(appointments).values({
            bookingCode,
            customerId,
            guestName: data.customerName,
            guestPhone: data.phone,
            guestEmail: data.email,
            optometristId: data.optometristId,
            appointmentDate: data.appointmentDate,
            appointmentTime: data.appointmentTime,
            serviceType: data.serviceType,
            notes: data.notes,
            status: 'pending'
        }).returning();

        return appointment;
    });
}

/**
 * Mengambil data janji temu berdasarkan kode booking.
 */
export async function getAppointmentByCode(bookingCode: string) {
    const [appointment] = await db
        .select()
        .from(appointments)
        .where(eq(appointments.bookingCode, bookingCode))
        .limit(1);

    return appointment;
}
/**
 * Mengambil data janji temu berdasarkan ID.
 */
export async function getAppointmentById(id: string) {
    const rows = await db
        .select({
            appointment: {
                id: appointments.id,
                bookingCode: appointments.bookingCode,
                customerId: appointments.customerId,
                guestName: appointments.guestName,
                guestPhone: appointments.guestPhone,
                guestEmail: appointments.guestEmail,
                optometristId: appointments.optometristId,
                appointmentDate: appointments.appointmentDate,
                appointmentTime: appointments.appointmentTime,
                serviceType: appointments.serviceType,
                status: appointments.status,
                notes: appointments.notes,
                createdAt: appointments.createdAt,
                updatedAt: appointments.updatedAt,
            },
            customer: {
                id: customers.id,
                firstName: customers.firstName,
                lastName: customers.lastName,
                email: customers.email,
                phone: customers.phone,
                birthDate: customers.birthDate,
            },
            optometrist: {
                id: optometrists.id,
                name: optometrists.name,
            },
            examHistory: {
                id: eyeExamHistory.id,
                customerId: eyeExamHistory.customerId,
                appointmentId: eyeExamHistory.appointmentId,
                optometristId: eyeExamHistory.optometristId,
                examDate: eyeExamHistory.examDate,
                reSphere: eyeExamHistory.reSphere,
                reCylinder: eyeExamHistory.reCylinder,
                reAxis: eyeExamHistory.reAxis,
                reAdd: eyeExamHistory.reAdd,
                leSphere: eyeExamHistory.leSphere,
                leCylinder: eyeExamHistory.leCylinder,
                leAxis: eyeExamHistory.leAxis,
                leAdd: eyeExamHistory.leAdd,
                pd: eyeExamHistory.pd,
                notes: eyeExamHistory.notes,
                nextExamDate: eyeExamHistory.nextExamDate,
                createdAt: eyeExamHistory.createdAt,
            }
        })
        .from(appointments)
        .leftJoin(customers, eq(appointments.customerId, customers.id))
        .leftJoin(optometrists, eq(appointments.optometristId, optometrists.id))
        .leftJoin(eyeExamHistory, eq(appointments.id, eyeExamHistory.appointmentId))
        .where(eq(appointments.id, id))
        .limit(1);

    if (rows.length === 0) return null;

    const { appointment, customer, optometrist, examHistory } = rows[0];

    return {
        ...appointment,
        customer: customer?.id ? customer : null,
        optometrist: optometrist?.id ? optometrist : null,
        examHistory: examHistory?.id ? examHistory : null
    };
}
