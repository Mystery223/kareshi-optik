import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import RevealWrapper from "@/components/ui/RevealWrapper";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { auth } from "@/auth";
import { isAdminOrStaff } from "@/lib/auth/roles";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createBlogPostAction(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session || !isAdminOrStaff(session.user.role)) {
    redirect("/login");
  }

  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const coverImage = String(formData.get("coverImage") || "").trim();
  const tagsInput = String(formData.get("tags") || "").trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!title || !content) {
    redirect("/admin/blog/new?error=missing-required-fields");
  }

  const baseSlug = slugify(slugInput || title);
  const safeSlug = baseSlug || `artikel-${Date.now()}`;
  const [existingSlug] = await db.select({ id: blogPosts.id }).from(blogPosts).where(eq(blogPosts.slug, safeSlug)).limit(1);
  const finalSlug = existingSlug ? `${safeSlug}-${Date.now()}` : safeSlug;

  const tags = tagsInput
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  try {
    await db.insert(blogPosts).values({
      title,
      slug: finalSlug,
      excerpt: excerpt || null,
      content,
      coverImage: coverImage || null,
      category: category || null,
      authorId: session.user.id,
      tags: tags.length > 0 ? tags : null,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    });
  } catch {
    redirect("/admin/blog/new?error=create-failed");
  }

  revalidatePath("/admin/blog");
  redirect("/admin/blog?created=1");
}

interface AdminNewBlogPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function AdminNewBlogPage({ searchParams }: AdminNewBlogPageProps) {
  const params = await searchParams;

  return (
    <div className="p-8 md:p-12 space-y-8">
      <RevealWrapper>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose mb-2">Management</p>
        <h1 className="font-serif text-5xl font-bold text-ink">
          Buat <span className="italic text-rose/80">Artikel</span>
        </h1>
      </RevealWrapper>

      {params.error && (
        <div className="rounded-2xl border border-rose/30 bg-rose/10 px-5 py-4 text-sm text-rose">
          Gagal menyimpan artikel. Pastikan `Judul` dan `Konten` terisi.
        </div>
      )}

      <RevealWrapper delay={0.1} className="rounded-[30px] border border-border/50 bg-paper-mid/70 p-8 md:p-10">
        <form action={createBlogPostAction} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Judul Artikel</label>
            <input
              name="title"
              required
              className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Slug (opsional)</label>
            <input
              name="slug"
              placeholder="auto dari judul jika kosong"
              className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Kategori</label>
            <input
              name="category"
              placeholder="Eye Health / Style Guide / Trends"
              className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Excerpt</label>
            <textarea
              name="excerpt"
              rows={2}
              className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Konten</label>
            <textarea
              name="content"
              required
              rows={10}
              className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Cover Image URL</label>
            <input
              name="coverImage"
              placeholder="https://..."
              className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Tags</label>
            <input
              name="tags"
              placeholder="blue-light, perawatan-mata, lifestyle"
              className="w-full rounded-2xl border border-border bg-paper px-4 py-3 outline-none focus:border-rose"
            />
          </div>

          <div className="md:col-span-2">
            <label className="inline-flex items-center gap-3 text-sm text-ink">
              <input name="isPublished" type="checkbox" className="h-4 w-4 rounded border-border text-rose focus:ring-rose" />
              Publish sekarang
            </label>
          </div>

          <div className="flex flex-col gap-3 pt-2 md:col-span-2 sm:flex-row">
            <button className="inline-flex items-center justify-center rounded-2xl bg-ink px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-paper transition-colors hover:bg-rose">
              Simpan Artikel
            </button>
            <Link
              href="/admin/blog"
              className="inline-flex items-center justify-center rounded-2xl border border-border px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-ink transition-colors hover:border-rose/50 hover:text-rose"
            >
              Kembali ke Blog
            </Link>
          </div>
        </form>
      </RevealWrapper>
    </div>
  );
}
