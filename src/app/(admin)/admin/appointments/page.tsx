import { db } from "@/lib/db";
import { appointments, customers, optometrists } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import RevealWrapper from "@/components/ui/RevealWrapper";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function AdminAppointmentsPage() {
    const allAppointmentsRaw = await db
        .select({
            id: appointments.id,
            bookingCode: appointments.bookingCode,
            guestName: appointments.guestName,
            guestPhone: appointments.guestPhone,
            appointmentDate: appointments.appointmentDate,
            appointmentTime: appointments.appointmentTime,
            serviceType: appointments.serviceType,
            status: appointments.status,
            customer: {
                id: customers.id,
                firstName: customers.firstName,
                lastName: customers.lastName,
                phone: customers.phone,
            },
            optometrist: {
                id: optometrists.id,
                name: optometrists.name,
            },
        })
        .from(appointments)
        .leftJoin(customers, eq(appointments.customerId, customers.id))
        .leftJoin(optometrists, eq(appointments.optometristId, optometrists.id))
        .orderBy(desc(appointments.appointmentDate), desc(appointments.appointmentTime));

    const allAppointments = allAppointmentsRaw.map((item) => ({
        ...item,
        customer: item.customer?.id ? item.customer : null,
        optometrist: item.optometrist?.id ? item.optometrist : null,
    }));

    return (
        <div className="p-8 md:p-12 space-y-12">
            <div>
                <RevealWrapper>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose mb-2">Bookings</p>
                    <h1 className="font-serif text-5xl font-bold text-ink">
                        Appointment <span className="italic text-rose/80">Management</span>
                    </h1>
                </RevealWrapper>
            </div>

            <RevealWrapper delay={0.2}>
                <div className="bg-paper-mid border border-border/30 rounded-[40px] overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border/30">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-light">Booking Code / Customer</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-light">Jadwal</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-light">Layanan / Optometrist</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-light text-center">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-light text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {allAppointments.map((apt) => (
                                <tr key={apt.id} className="hover:bg-white/40 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-rose uppercase tracking-tighter">{apt.bookingCode}</p>
                                            <p className="font-bold text-ink">{apt.customer?.firstName || apt.guestName} {apt.customer?.lastName || ""}</p>
                                            <p className="text-[10px] text-ink-mid uppercase tracking-tighter">{apt.customer?.phone || apt.guestPhone}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="font-bold text-ink text-sm">
                                                {format(new Date(apt.appointmentDate), "dd MMM yyyy", { locale: id })}
                                            </p>
                                            <p className="text-[10px] text-ink-mid uppercase">{apt.appointmentTime}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="font-medium text-ink text-xs">{apt.serviceType}</p>
                                            <p className="text-[10px] text-rose uppercase font-bold">{apt.optometrist?.name || "Unassigned"}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className={`inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    apt.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-ink/5 text-ink-mid'
                                            }`}>
                                            {apt.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Link
                                            href={`/admin/appointments/${apt.id}`}
                                            className="text-[10px] font-black uppercase tracking-widest text-ink-light hover:text-rose transition-colors"
                                        >
                                            Detail ↗
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </RevealWrapper>
        </div>
    );
}
