import { getAppointmentById } from "@/lib/db/queries/appointments";
import { notFound } from "next/navigation";
import AppointmentDetailClient from "./AppointmentDetailClient";

export default async function AdminAppointmentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const appointment = await getAppointmentById(id);

    if (!appointment) {
        notFound();
    }

    return <AppointmentDetailClient appointment={appointment} />;
}
