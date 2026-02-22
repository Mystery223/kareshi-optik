import RevealWrapper from "@/components/ui/RevealWrapper";
import { db } from "@/lib/db";
import { appointments, orders, products } from "@/lib/db/schema";
import { count, eq, desc } from "drizzle-orm";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function AdminPage() {
    // 1. Fetch Stats
    const [appointmentCount] = await db.select({ val: count() }).from(appointments);
    const [orderCount] = await db.select({ val: count() }).from(orders);
    const [productCount] = await db.select({ val: count() }).from(products);
    const [pendingOrders] = await db.select({ val: count() }).from(orders).where(eq(orders.status, 'pending'));

    // 2. Fetch Recent Appointments
    const recentAppointments = await db
        .select()
        .from(appointments)
        .orderBy(desc(appointments.createdAt))
        .limit(5);

    return (
        <div className="p-8 md:p-12 space-y-12">
            {/* Header */}
            <div>
                <RevealWrapper>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose mb-2">Management</p>
                    <h1 className="font-serif text-5xl font-bold text-ink">
                        Sales <span className="italic text-rose/80">Overview</span>
                    </h1>
                </RevealWrapper>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Janji Temu", val: appointmentCount.val, color: "bg-paper-mid" },
                    { label: "Total Pesanan", val: orderCount.val, color: "bg-paper-mid" },
                    { label: "Pesanan Tertunda", val: pendingOrders.val, color: "bg-ink text-paper" },
                    { label: "Total Produk", val: productCount.val, color: "bg-paper-mid" },
                ].map((stat, i) => (
                    <RevealWrapper key={stat.label} delay={0.1 * (i + 1)}>
                        <div className={`${stat.color} border border-border/50 rounded-[40px] p-10 space-y-4`}>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{stat.label}</p>
                            <h3 className="font-serif text-4xl font-bold">{stat.val}</h3>
                        </div>
                    </RevealWrapper>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-12">
                {/* Recent Appointments */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between border-b border-border/50 pb-6">
                        <h2 className="font-serif text-3xl font-bold italic text-ink">Janji Temu Terbaru</h2>
                        <Link href="/admin/appointments" className="text-[10px] font-bold uppercase tracking-widest text-rose">Lihat Semua</Link>
                    </div>

                    <div className="space-y-4">
                        {recentAppointments.map((apt) => (
                            <div key={apt.id} className="flex items-center justify-between p-6 rounded-[30px] border border-border/20 hover:bg-paper-mid transition-colors">
                                <div className="space-y-1">
                                    <p className="font-bold text-ink">{apt.guestName || "Customer"}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-ink-light">{apt.serviceType}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium text-ink">
                                        {format(new Date(apt.appointmentDate), "dd MMM yyyy", { locale: id })}
                                    </p>
                                    <p className="text-[10px] uppercase text-rose font-bold">{apt.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions / Alerts */}
                <RevealWrapper delay={0.5} className="bg-ink text-paper rounded-[50px] p-12 space-y-8 flex flex-col justify-between h-fit">
                    <div className="space-y-4">
                        <h3 className="font-serif text-3xl font-bold italic">Quick Actions</h3>
                        <p className="text-sm text-paper-mid">Akses cepat fitur manajemen operasional.</p>
                    </div>

                    <div className="space-y-4">
                        <Link href="/admin/produk/new" className="block w-full py-4 text-center rounded-2xl bg-paper text-ink text-[10px] font-black uppercase tracking-widest hover:bg-rose hover:text-paper transition-all">
                            Tambah Produk Baru
                        </Link>
                        <Link href="/admin/orders" className="block w-full py-4 text-center rounded-2xl border border-paper/20 text-paper text-[10px] font-black uppercase tracking-widest hover:border-paper transition-all">
                            Kelola Pesanan
                        </Link>
                    </div>
                </RevealWrapper>
            </div>
        </div>
    );
}
