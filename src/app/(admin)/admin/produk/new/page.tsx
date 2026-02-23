import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
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

async function createProductAction(formData: FormData) {
  "use server";
  const session = await auth();
  const role = session?.user?.role;
  if (!session || !isAdminOrStaff(role)) {
    redirect("/login");
  }

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

  if (!name || !sku || !priceRaw || !brandId) {
    redirect("/admin/produk/new?error=missing-required-fields");
  }

  const price = Number(priceRaw);
  const stock = Number(stockRaw || "0");
  if (Number.isNaN(price) || price <= 0) {
    redirect("/admin/produk/new?error=invalid-price");
  }

  const slugBase = slugRaw ? slugify(slugRaw) : slugify(name);
  const slug = slugBase || `product-${nanoid(6).toLowerCase()}`;
  const categoryId = categoryIdRaw || null;
  const [brand] = await db.select({ slug: brands.slug }).from(brands).where(eq(brands.id, brandId)).limit(1);
  const brandSlug = brand?.slug || "";
  const brandImageMap: Record<string, string> = {
    "ray-ban": "/images/products/brands/ray-ban.svg",
    "oakley": "/images/products/brands/oakley.svg",
    "gucci": "/images/products/brands/gucci.svg",
    "tom-ford": "/images/products/brands/tom-ford.svg",
    "oliver-peoples": "/images/products/brands/oliver-peoples.svg",
  };
  const defaultBrandImage = brandImageMap[brandSlug] || "/images/products/brands/default.svg";
  const effectiveThumbnail = thumbnailUrl || defaultBrandImage;

  try {
    const inserted = await db.transaction(async (tx) => {
      const [product] = await tx
        .insert(products)
        .values({
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
          thumbnailUrl: effectiveThumbnail,
          images: [effectiveThumbnail],
          isActive: true,
        })
        .returning();

      await tx.insert(productVariants).values({
        productId: product.id,
        colorName: "Default",
        stock: Number.isNaN(stock) ? 0 : stock,
        skuVariant: `${sku}-DFT-${nanoid(4).toUpperCase()}`,
        isActive: true,
      });

      return product;
    });

    revalidatePath("/admin/produk");
    await invalidateProductCaches();
    redirect(`/admin/produk?created=${inserted.id}`);
  } catch {
    redirect("/admin/produk/new?error=create-failed");
  }
}

interface AdminNewProductPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function AdminNewProductPage({ searchParams }: AdminNewProductPageProps) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session || !isAdminOrStaff(role)) {
    redirect("/login");
  }

  const [brandRows, categoryRows, params] = await Promise.all([
    db.select().from(brands).orderBy(asc(brands.name)),
    db.select().from(categories).orderBy(asc(categories.name)),
    searchParams,
  ]);

  return (
    <div className="p-8 md:p-12 space-y-10">
      <div className="flex items-end justify-between gap-6">
        <RevealWrapper>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose mb-2">Inventory</p>
          <h1 className="font-serif text-5xl font-bold text-ink">
            Tambah <span className="italic text-rose/80">Produk</span>
          </h1>
        </RevealWrapper>

        <Link
          href="/admin/produk"
          className="rounded-2xl border border-border px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-ink transition-colors hover:border-rose/50 hover:text-rose"
        >
          Kembali
        </Link>
      </div>

      {params.error && (
        <div className="rounded-2xl border border-rose/30 bg-rose/10 px-5 py-4 text-sm text-rose">
          Gagal menyimpan produk. Periksa input lalu coba lagi.
        </div>
      )}

      <RevealWrapper delay={0.15} className="rounded-[32px] border border-border/50 bg-paper-mid p-8 md:p-10">
        <form action={createProductAction} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Nama Produk</label>
            <input name="name" required className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">SKU</label>
            <input name="sku" required className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Slug (opsional)</label>
            <input name="slug" placeholder="auto dari nama jika kosong" className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Brand</label>
            <select name="brandId" required className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose">
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
            <select name="categoryId" className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose">
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
            <input name="price" type="number" min="1" required className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Stok Awal</label>
            <input name="stock" type="number" min="0" defaultValue="0" className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Gender</label>
            <select name="gender" className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose">
              <option value="">Tidak ditentukan</option>
              <option value="pria">Pria</option>
              <option value="wanita">Wanita</option>
              <option value="unisex">Unisex</option>
              <option value="anak">Anak</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Bentuk Frame</label>
            <input name="shape" placeholder="kotak / bulat / aviator..." className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Material</label>
            <input name="material" placeholder="Acetate, Titanium, Metal..." className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Thumbnail URL</label>
            <input
              name="thumbnailUrl"
              placeholder="https://... (opsional)"
              className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Deskripsi</label>
            <textarea name="description" rows={4} className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose" />
          </div>

          <div className="md:col-span-2 pt-2">
            <button className="w-full rounded-2xl bg-ink px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-paper transition-colors hover:bg-rose">
              Simpan Produk
            </button>
          </div>
        </form>
      </RevealWrapper>
    </div>
  );
}
