import { auth } from "@/auth";
import { db } from "@/lib/db";
import { eyeExamHistory, appointments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isAdminOrStaff } from "@/lib/auth/roles";

export async function POST(req: Request) {
    const session = await auth();

    if (!session || !isAdminOrStaff(session.user.role)) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const {
            appointmentId,
            customerId,
            reSphere,
            reCylinder,
            reAxis,
            reAdd,
            leSphere,
            leCylinder,
            leAxis,
            leAdd,
            pd,
            notes
        } = body;

        if (!appointmentId || !customerId) {
            return new NextResponse("Missing appointmentId or customerId", { status: 400 });
        }

        // 1. Upsert eye exam history
        const [existingExam] = await db
            .select()
            .from(eyeExamHistory)
            .where(eq(eyeExamHistory.appointmentId, appointmentId))
            .limit(1);

        if (existingExam) {
            await db.update(eyeExamHistory).set({
                reSphere,
                reCylinder,
                reAxis: reAxis ? parseInt(reAxis) : null,
                reAdd,
                leSphere,
                leCylinder,
                leAxis: leAxis ? parseInt(leAxis) : null,
                leAdd,
                pd,
                notes,
            }).where(eq(eyeExamHistory.id, existingExam.id));
        } else {
            await db.insert(eyeExamHistory).values({
                customerId,
                appointmentId,
                optometristId: session.user.id, // Assuming staff ID matches optometrist ID or name
                examDate: new Date().toISOString().split('T')[0],
                reSphere,
                reCylinder,
                reAxis: reAxis ? parseInt(reAxis) : null,
                reAdd,
                leSphere,
                leCylinder,
                leAxis: leAxis ? parseInt(leAxis) : null,
                leAdd,
                pd,
                notes,
            });
        }

        // 2. Mark appointment as completed
        await db.update(appointments).set({
            status: 'completed',
            completedAt: new Date(),
        }).where(eq(appointments.id, appointmentId));

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal Server Error";
        console.error("[EXAM_POST]", error);
        return new NextResponse(message, { status: 500 });
    }
}
