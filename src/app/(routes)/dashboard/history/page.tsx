import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RevealWrapper from "@/components/ui/RevealWrapper";
import Link from "next/link";
import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function HistoryPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const userAppointments = await db
        .select()
        .from(appointments)
        .where(eq(appointments.customerId, session.user.id))
        .orderBy(desc(appointments.appointmentDate));

    return (
        <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/50 pb-12">
                    <RevealWrapper className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose">Customer Portal</p>
                        <h1 className="font-serif text-5xl md:text-7xl font-bold text-ink">
                            Riwayat <span className="italic">Janji Temu</span>
                        </h1>
                        <p className="text-ink-mid max-w-lg">Lihat kembali riwayat pemeriksaan dan konsultasi mata Anda di Kareshi Optik.</p>
                    </RevealWrapper>

                    <RevealWrapper delay={0.2}>
                        <Link
                            href="/dashboard"
                            className="text-[10px] font-bold uppercase tracking-widest text-ink-light hover:text-rose transition-colors"
                        >
                            ← Kembali ke Dashboard
                        </Link>
                    </RevealWrapper>
                </div>

                {/* Appointment List Full */}
                <RevealWrapper delay={0.3} className="space-y-8">
                    <div className="space-y-4">
                        {userAppointments.length > 0 ? (
                            userAppointments.map((apt) => (
                                <div key={apt.id} className="group flex flex-col md:flex-row md:items-center justify-between p-8 rounded-[40px] border border-border/30 hover:bg-paper-mid transition-all hover:scale-[1.01] gap-6 bg-paper/50 backdrop-blur-sm">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Booking Code: {apt.bookingCode}</p>
                                        <h4 className="font-bold text-xl text-ink">{apt.serviceType}</h4>
                                        {apt.notes && <p className="text-xs text-ink-mid italic">Note: {apt.notes}</p>}
                                    </div>

                                    <div className="flex items-center gap-12">
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-light">Tanggal & Waktu</p>
                                            <p className="text-sm font-medium text-ink">
                                                {format(new Date(apt.appointmentDate), "EEEE, dd MMMM yyyy", { locale: id })}
                                            </p>
                                            <p className="text-xs text-ink-mid">{apt.appointmentTime}</p>
                                        </div>

                                        <div className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    apt.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-ink/5 text-ink-mid'
                                            }`}>
                                            {apt.status}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-paper-mid rounded-[40px] border border-dashed border-border/50">
                                <p className="text-ink-mid">Belum ada riwayat janji temu.</p>
                                <Link href="/appointment" className="mt-4 inline-block text-rose text-xs font-bold uppercase tracking-widest">Buat Janji Pertama Anda →</Link>
                            </div>
                        )}
                    </div>
                </RevealWrapper>
            </div>
        </div>
    );
}
