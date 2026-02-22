import { NextRequest, NextResponse } from 'next/server';
import { createAppointment } from '@/lib/db/queries/appointments';
import { appointmentSchema } from '@/lib/validations/appointment';
import { sendBookingConfirmation, sendAdminNotification } from '@/lib/mail/resend';
import { checkRateLimit, logRateLimitBlocked } from '@/lib/cache/redis';

import { auth } from '@/auth';

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        const forwarded = req.headers.get("x-forwarded-for");
        const realIp = req.headers.get("x-real-ip");
        const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown";
        const ipLimit = await checkRateLimit({
            key: `booking:ip:${ip}`,
            limit: 10,
            windowSeconds: 60,
            identifier: ip,
            channel: "booking",
        });

        if (!ipLimit.allowed) {
            logRateLimitBlocked({
                channel: "booking",
                key: `booking:ip:${ip}`,
                identifier: ip,
                limit: 10,
                windowSeconds: 60,
                retryAfter: ipLimit.retryAfter,
                current: ipLimit.current,
            });
            return NextResponse.json(
                { message: `Terlalu banyak request booking. Coba lagi dalam ${ipLimit.retryAfter} detik.` },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(ipLimit.retryAfter),
                    },
                }
            );
        }

        const body = await req.json();

        // Validate input
        const validatedData = appointmentSchema.parse(body);

        const appointment = await createAppointment({
            customerName: validatedData.customerName,
            phone: validatedData.phone,
            email: validatedData.email,
            optometristId: validatedData.optometristId,
            appointmentDate: validatedData.date,
            appointmentTime: validatedData.time,
            serviceType: validatedData.serviceType,
            notes: validatedData.notes,
            customerId: session?.user?.id,
        });

        // Send Notifications (Async)
        if (appointment && validatedData.email) {
            sendBookingConfirmation({
                customerName: validatedData.customerName,
                bookingCode: appointment.bookingCode,
                date: validatedData.date,
                time: validatedData.time,
                serviceType: validatedData.serviceType,
                email: validatedData.email
            });
        }

        sendAdminNotification({
            customerName: validatedData.customerName,
            bookingCode: appointment.bookingCode,
            date: validatedData.date,
            time: validatedData.time,
            serviceType: validatedData.serviceType,
        });

        return NextResponse.json(appointment);
    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json({ message: 'Data booking tidak valid' }, { status: 400 });
        }
        console.error('[BOOKING_POST]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
