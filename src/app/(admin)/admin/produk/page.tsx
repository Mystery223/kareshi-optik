import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import RevealWrapper from "@/components/ui/RevealWrapper";
import Link from "next/link";
import DeleteProductButton from "@/components/product/DeleteProductButton";
import { auth } from "@/auth";
import { canDeleteProduct } from "@/lib/auth/roles";

export default async function AdminProductsPage() {
    const session = await auth();
    const canDelete = canDeleteProduct(session?.user?.role);

    const allProducts = await db.query.products.findMany({
        with: {
            brand: true,
            category: true,
            variants: true,
        },
        orderBy: desc(products.createdAt),
    });

    return (
        <div className="p-8 md:p-12 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <RevealWrapper>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose mb-2">Inventory</p>
                    <h1 className="font-serif text-5xl font-bold text-ink">
                        Product <span className="italic text-rose/80">Management</span>
                    </h1>
                </RevealWrapper>

                <RevealWrapper delay={0.2}>
                    <Link href="/admin/produk/new" className="px-8 py-4 bg-ink text-paper text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose hover:scale-[1.02] transition-all inline-block">
                        + Tambah Produk
                    </Link>
                </RevealWrapper>
            </div>

            <RevealWrapper delay={0.3}>
                <div className="bg-paper-mid border border-border/30 rounded-[40px] overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border/30">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-light">SKU / Nama</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-light">Kategori</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-light text-center">Stok</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-light text-right">Harga</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-light text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {allProducts.map((product) => {
                                const totalStock = product.variants.reduce((acc, v) => acc + (v.stock || 0), 0);

                                return (
                                    <tr key={product.id} className="hover:bg-white/40 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-rose uppercase tracking-tighter">{product.sku}</p>
                                                <p className="font-bold text-ink">{product.name}</p>
                                                <p className="text-[10px] text-ink-mid uppercase">{product.brand?.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-ink/5 rounded-full text-[10px] font-bold uppercase text-ink-mid">
                                                {product.category?.name || "Uncategorized"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <p className={`font-bold ${totalStock <= 5 ? 'text-rose' : 'text-ink'}`}>
                                                {totalStock}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="font-bold text-ink">
                                                Rp {Number(product.price).toLocaleString('id-ID')}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-right flex items-center justify-end whitespace-nowrap">
                                            <Link
                                                href={`/admin/produk/${product.id}/edit`}
                                                className="text-[10px] font-black uppercase tracking-widest text-ink-light hover:text-rose transition-colors"
                                            >
                                                Edit ↗
                                            </Link>
                                            {canDelete ? (
                                                <DeleteProductButton productId={product.id} productName={product.name} />
                                            ) : (
                                                <span className="ml-4 text-[9px] font-bold uppercase tracking-wider text-ink-light/70">
                                                    Admin only
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </RevealWrapper>
        </div>
    );
}
