import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import RevealWrapper from "@/components/ui/RevealWrapper";
import Link from "next/link";
import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { isAdminOrStaff } from "@/lib/auth/roles";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (isAdminOrStaff(session.user.role)) {
    redirect("/admin");
  }

  // Fetch total count and last 5 appointments
  const [appointmentsCount] = await db
    .select({ val: count() })
    .from(appointments)
    .where(eq(appointments.customerId, session.user.id));

  const userAppointments = await db
    .select()
    .from(appointments)
    .where(eq(appointments.customerId, session.user.id))
    .orderBy(desc(appointments.appointmentDate))
    .limit(5);

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <RevealWrapper className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose">Customer Portal</p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-ink">
              Halo, <span className="italic">{session.user.name?.split(" ")[0]}</span>
            </h1>
          </RevealWrapper>

          <RevealWrapper delay={0.2} className="w-full md:w-auto">
            <div className="rounded-3xl border border-border/60 bg-paper-mid/70 p-3 sm:p-4 backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard/profile"
                  className="inline-flex items-center justify-center rounded-2xl border border-border bg-paper px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-ink transition-colors hover:border-rose/50 hover:text-rose"
                >
                  Pengaturan Profil
                </Link>
                <form action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}>
                  <button className="inline-flex w-full items-center justify-center rounded-2xl bg-ink px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-paper transition-colors hover:bg-rose">
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </RevealWrapper>
        </div>

        {/* Stats / Quick Actions */}
        <div className="grid md:grid-cols-4 gap-8">
          <RevealWrapper delay={0.3} className="bg-paper-mid border border-border/50 rounded-[40px] p-10 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Total Janji Temu</p>
            <h3 className="font-serif text-4xl font-bold text-ink">{appointmentsCount.val}</h3>
          </RevealWrapper>

          <RevealWrapper delay={0.4} className="bg-paper-mid border border-border/50 rounded-[40px] p-10 space-y-4 cursor-pointer hover:border-rose/30 transition-colors">
            <Link href="/dashboard/medical" className="block space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Rekam Medis</p>
              <h3 className="font-serif text-4xl font-bold text-ink italic">Lihat ↗</h3>
            </Link>
          </RevealWrapper>

          <RevealWrapper delay={0.5} className="bg-paper-mid border border-border/50 rounded-[40px] p-10 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Pesanan Aktif</p>
            <h3 className="font-serif text-4xl font-bold text-ink">0</h3>
          </RevealWrapper>

          <RevealWrapper delay={0.6} className="bg-rose text-paper rounded-[40px] p-10 flex flex-col justify-between group hover:scale-[1.02] transition-transform cursor-pointer">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Quick Action</p>
            <Link href="/appointment" className="space-y-2">
              <h3 className="font-serif text-2xl font-bold">Buat Janji Temu</h3>
              <p className="text-xs opacity-70">Pilih jadwal periksa mata Anda sekarang.</p>
            </Link>
          </RevealWrapper>
        </div>

        {/* Appointment List */}
        <RevealWrapper delay={0.7} className="space-y-8">
          <div className="flex items-center justify-between border-b border-border/50 pb-6">
            <h2 className="font-serif text-3xl font-bold italic text-ink">Janji Temu Terakhir</h2>
            <Link href="/dashboard/history" className="text-[10px] font-bold uppercase tracking-widest text-rose">Lihat Semua History</Link>
          </div>

          <div className="space-y-4">
            {userAppointments.length > 0 ? (
              userAppointments.map((apt) => (
                <div key={apt.id} className="group flex flex-col md:flex-row md:items-center justify-between p-8 rounded-[30px] border border-border/30 hover:bg-paper-mid transition-colors gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Booking Code: {apt.bookingCode}</p>
                    <h4 className="font-bold text-lg text-ink">{apt.serviceType}</h4>
                  </div>

                  <div className="flex items-center gap-12">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-ink-light">Tanggal & Waktu</p>
                      <p className="text-sm font-medium text-ink">
                        {format(new Date(apt.appointmentDate), "EEEE, dd MMMM yyyy", { locale: id })}
                      </p>
                      <p className="text-xs text-ink-mid">{apt.appointmentTime}</p>
                    </div>

                    <div className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
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
              </div>
            )}
          </div>
        </RevealWrapper>
      </div>
    </div>
  );
}
