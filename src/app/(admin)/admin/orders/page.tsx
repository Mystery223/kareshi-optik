import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import RevealWrapper from "@/components/ui/RevealWrapper";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function AdminOrdersPage() {
    const allOrders = await db.query.orders.findMany({
        with: {
            customer: true,
            handledBy: true,
        },
        orderBy: desc(orders.createdAt),
    });

    return (
        <div className="p-8 md:p-12 space-y-12">
            <div>
                <RevealWrapper>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose mb-2">Sales</p>
                    <h1 className="font-serif text-5xl font-bold text-ink">
                        Order <span className="italic text-rose/80">Management</span>
                    </h1>
                </RevealWrapper>
            </div>

            <RevealWrapper delay={0.2}>
                <div className="bg-paper-mid border border-border/30 rounded-[40px] overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border/30">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-light">Order Code / Customer</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-light">Tanggal</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-light text-center">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-light text-right">Total</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-light text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {allOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-white/40 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-rose uppercase tracking-tighter">{order.orderCode}</p>
                                            <p className="font-bold text-ink">{order.customer?.firstName} {order.customer?.lastName}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-[10px] font-medium text-ink-mid">
                                            {format(new Date(order.createdAt), "dd MMMM yyyy HH:mm", { locale: id })}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className={`inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-ink/5 text-ink-mid'
                                            }`}>
                                            {order.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <p className="font-bold text-ink text-sm">
                                            Rp {Number(order.totalPrice).toLocaleString('id-ID')}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
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
