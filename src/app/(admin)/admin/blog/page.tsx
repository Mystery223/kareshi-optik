import Link from "next/link";
import RevealWrapper from "@/components/ui/RevealWrapper";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { count, desc } from "drizzle-orm";
import { format } from "date-fns";

export default async function AdminBlogPage() {
  const [totalPosts] = await db.select({ val: count() }).from(blogPosts);
  const postRows = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)).limit(20);

  return (
    <div className="p-8 md:p-12 space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <RevealWrapper>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose mb-2">Management</p>
          <h1 className="font-serif text-5xl font-bold text-ink">
            Konten <span className="italic text-rose/80">Blog</span>
          </h1>
        </RevealWrapper>

        <Link
          href="/admin/blog/new"
          className="inline-flex rounded-2xl bg-ink px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-paper transition-colors hover:bg-rose"
        >
          Tambah Artikel
        </Link>
      </div>

      <RevealWrapper delay={0.1} className="rounded-[30px] border border-border/50 bg-paper-mid p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Total Artikel</p>
        <p className="mt-3 font-serif text-5xl font-bold text-ink">{totalPosts.val}</p>
      </RevealWrapper>

      <RevealWrapper delay={0.2} className="overflow-hidden rounded-[30px] border border-border/50 bg-paper">
        <div className="grid grid-cols-12 border-b border-border/60 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-ink-light">
          <div className="col-span-5">Judul</div>
          <div className="col-span-2">Kategori</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3 text-right">Tanggal</div>
        </div>

        <div className="divide-y divide-border/40">
          {postRows.length > 0 ? (
            postRows.map((post) => (
              <div key={post.id} className="grid grid-cols-12 px-6 py-4 text-sm">
                <div className="col-span-5">
                  <p className="font-bold text-ink">{post.title}</p>
                  <p className="text-xs text-ink-light">/{post.slug}</p>
                </div>
                <div className="col-span-2 text-ink-mid">{post.category || "-"}</div>
                <div className="col-span-2">
                  <span className={post.isPublished ? "text-green-700" : "text-amber-700"}>
                    {post.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="col-span-3 text-right text-ink-mid">
                  {post.createdAt ? format(new Date(post.createdAt), "dd/MM/yyyy") : "-"}
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-ink-mid">Belum ada artikel blog.</div>
          )}
        </div>
      </RevealWrapper>
    </div>
  );
}
