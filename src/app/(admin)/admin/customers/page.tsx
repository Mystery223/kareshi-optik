import RevealWrapper from "@/components/ui/RevealWrapper";
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";
import { count, desc } from "drizzle-orm";

export default async function AdminCustomersPage() {
  const [totalCustomers] = await db.select({ val: count() }).from(customers);
  const customerRows = await db.select().from(customers).orderBy(desc(customers.createdAt)).limit(20);

  return (
    <div className="p-8 md:p-12 space-y-10">
      <RevealWrapper>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose mb-2">Management</p>
        <h1 className="font-serif text-5xl font-bold text-ink">
          Data <span className="italic text-rose/80">Customers</span>
        </h1>
      </RevealWrapper>

      <RevealWrapper delay={0.1} className="rounded-[30px] border border-border/50 bg-paper-mid p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Total Customers</p>
        <p className="mt-3 font-serif text-5xl font-bold text-ink">{totalCustomers.val}</p>
      </RevealWrapper>

      <RevealWrapper delay={0.2} className="overflow-hidden rounded-[30px] border border-border/50 bg-paper">
        <div className="grid grid-cols-12 border-b border-border/60 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-ink-light">
          <div className="col-span-4">Nama</div>
          <div className="col-span-4">Kontak</div>
          <div className="col-span-4">Lokasi</div>
        </div>

        <div className="divide-y divide-border/40">
          {customerRows.length > 0 ? (
            customerRows.map((customer) => (
              <div key={customer.id} className="grid grid-cols-12 px-6 py-4 text-sm">
                <div className="col-span-4">
                  <p className="font-bold text-ink">{[customer.firstName, customer.lastName].filter(Boolean).join(" ") || "-"}</p>
                  <p className="text-xs text-ink-light">{customer.id.slice(0, 8)}...</p>
                </div>
                <div className="col-span-4">
                  <p className="text-ink-mid">{customer.email || "-"}</p>
                  <p className="text-ink-mid">{customer.phone || "-"}</p>
                </div>
                <div className="col-span-4">
                  <p className="text-ink-mid">{customer.city || "-"}</p>
                  <p className="text-ink-mid">{customer.address || "-"}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-ink-mid">Belum ada data customer.</div>
          )}
        </div>
      </RevealWrapper>
    </div>
  );
}
