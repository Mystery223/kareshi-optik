import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import RevealWrapper from "@/components/ui/RevealWrapper";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { brands, categories, products, productVariants } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { invalidateProductCaches } from "@/lib/cache/redis";
import { isAdminOrStaff } from "@/lib/auth/roles";

function slugify(input: string) {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function updateProductAction(formData: FormData) {
    "use server";
    const session = await auth();
    const role = session?.user?.role;
    if (!session || !isAdminOrStaff(role)) {
        redirect("/login");
    }

    const id = String(formData.get("id") || "");
    const name = String(formData.get("name") || "").trim();
    const sku = String(formData.get("sku") || "").trim().toUpperCase();
    const slugRaw = String(formData.get("slug") || "").trim();
    const priceRaw = String(formData.get("price") || "").trim();
    const brandId = String(formData.get("brandId") || "").trim();
    const categoryIdRaw = String(formData.get("categoryId") || "").trim();
    const gender = String(formData.get("gender") || "").trim();
    const material = String(formData.get("material") || "").trim();
    const shape = String(formData.get("shape") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const thumbnailUrl = String(formData.get("thumbnailUrl") || "").trim();
    const stockRaw = String(formData.get("stock") || "").trim();

    if (!id || !name || !sku || !priceRaw || !brandId) {
        redirect(`/admin/produk/${id}/edit?error=missing-required-fields`);
    }

    const price = Number(priceRaw);
    const stock = Number(stockRaw || "0");
    if (Number.isNaN(price) || price <= 0) {
        redirect(`/admin/produk/${id}/edit?error=invalid-price`);
    }

    const slugBase = slugRaw ? slugify(slugRaw) : slugify(name);
    const slug = slugBase || `product-${id.slice(0, 6)}`;
    const categoryId = categoryIdRaw || null;

    try {
        await db.transaction(async (tx) => {
            // Update Product
            await tx
                .update(products)
                .set({
                    sku,
                    name,
                    slug,
                    brandId,
                    categoryId,
                    gender: gender || null,
                    material: material || null,
                    shape: shape || null,
                    price: price.toString(),
                    description: description || null,
                    thumbnailUrl,
                    updatedAt: new Date(),
                })
                .where(eq(products.id, id));

            // Update default variant stock if exists
            const variants = await tx.select().from(productVariants).where(eq(productVariants.productId, id)).orderBy(asc(productVariants.createdAt));

            if (variants.length > 0) {
                await tx
                    .update(productVariants)
                    .set({
                        stock: Number.isNaN(stock) ? 0 : stock,
                    })
                    .where(eq(productVariants.id, variants[0].id));
            }
        });

        revalidatePath("/admin/produk");
        revalidatePath(`/admin/produk/${id}/edit`);
        await invalidateProductCaches();
        redirect(`/admin/produk?updated=${id}`);
    } catch (error) {
        console.error("Update failed:", error);
        redirect(`/admin/produk/${id}/edit?error=update-failed`);
    }
}

interface AdminEditProductPageProps {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<{
        error?: string;
    }>;
}

export default async function AdminEditProductPage({ params, searchParams }: AdminEditProductPageProps) {
    const session = await auth();
    const role = session?.user?.role;
    if (!session || !isAdminOrStaff(role)) {
        redirect("/login");
    }

    const { id: productId } = await params;
    const [brandRows, categoryRows, queryParams] = await Promise.all([
        db.select().from(brands).orderBy(asc(brands.name)),
        db.select().from(categories).orderBy(asc(categories.name)),
        searchParams,
    ]);

    const product = await db.query.products.findFirst({
        where: eq(products.id, productId),
        with: {
            variants: true
        }
    });

    if (!product) {
        notFound();
    }

    const defaultStock = product.variants?.[0]?.stock || 0;

    return (
        <div className="p-8 md:p-12 space-y-10">
            <div className="flex items-end justify-between gap-6">
                <RevealWrapper>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose mb-2">Inventory Management</p>
                    <h1 className="font-serif text-5xl font-bold text-ink">
                        Edit <span className="italic text-rose/80">Produk</span>
                    </h1>
                </RevealWrapper>

                <Link
                    href="/admin/produk"
                    className="rounded-2xl border border-border px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-ink transition-colors hover:border-rose/50 hover:text-rose"
                >
                    Kembali
                </Link>
            </div>

            {queryParams.error && (
                <div className="rounded-2xl border border-rose/30 bg-rose/10 px-5 py-4 text-sm text-rose">
                    Gagal memperbarui produk. Periksa input lalu coba lagi.
                </div>
            )}

            <RevealWrapper delay={0.15} className="rounded-[32px] border border-border/50 bg-paper-mid p-8 md:p-10">
                <form action={updateProductAction} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <input type="hidden" name="id" value={product.id} />

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Nama Produk</label>
                        <input name="name" defaultValue={product.name} required className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">SKU</label>
                        <input name="sku" defaultValue={product.sku} required className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Slug</label>
                        <input name="slug" defaultValue={product.slug} placeholder="auto dari nama jika kosong" className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Brand</label>
                        <select name="brandId" defaultValue={product.brandId} required className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose">
                            <option value="">Pilih Brand</option>
                            {brandRows.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Kategori</label>
                        <select name="categoryId" defaultValue={product.categoryId || ""} className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose">
                            <option value="">Tanpa Kategori</option>
                            {categoryRows.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Harga</label>
                        <input name="price" type="number" min="1" defaultValue={Number(product.price)} required className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Stok</label>
                        <input name="stock" type="number" min="0" defaultValue={defaultStock} className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Gender</label>
                        <select name="gender" defaultValue={product.gender || ""} className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose">
                            <option value="">Tidak ditentukan</option>
                            <option value="pria">Pria</option>
                            <option value="wanita">Wanita</option>
                            <option value="unisex">Unisex</option>
                            <option value="anak">Anak</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Bentuk Frame</label>
                        <input name="shape" defaultValue={product.shape || ""} placeholder="kotak / bulat / aviator..." className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose" />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Material</label>
                        <input name="material" defaultValue={product.material || ""} placeholder="Acetate, Titanium, Metal..." className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose" />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Thumbnail URL</label>
                        <input
                            name="thumbnailUrl"
                            defaultValue={product.thumbnailUrl || ""}
                            placeholder="https://... (opsional)"
                            className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Deskripsi</label>
                        <textarea name="description" defaultValue={product.description || ""} rows={4} className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose" />
                    </div>

                    <div className="md:col-span-2 pt-2">
                        <button className="w-full rounded-2xl bg-ink px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-paper transition-colors hover:bg-rose">
                            Perbarui Produk
                        </button>
                    </div>
                </form>
            </RevealWrapper>
        </div>
    );
}
