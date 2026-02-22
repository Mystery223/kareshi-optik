import Link from "next/link";

interface TipsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function toReadableTitle(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function TipsDetailPage({ params }: TipsDetailPageProps) {
  const { slug } = await params;
  const title = toReadableTitle(slug);

  return (
    <main className="min-h-screen bg-paper pt-32 pb-24">
      <article className="container mx-auto max-w-4xl px-6 space-y-8">
        <Link href="/tips" className="inline-flex text-xs font-bold uppercase tracking-widest text-ink-mid transition-colors hover:text-rose">
          ← Kembali ke Tips
        </Link>

        <header className="space-y-5 border-b border-border pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose">Journal</p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-ink leading-tight">{title}</h1>
          <p className="text-ink-mid">Halaman artikel sedang disiapkan. Konten detail akan segera tersedia.</p>
        </header>

        <section className="rounded-3xl border border-border bg-paper-mid/40 p-8 text-ink-mid leading-relaxed">
          <p>
            Anda membuka slug: <span className="font-bold text-ink">{slug}</span>.
          </p>
          <p className="mt-4">
            Untuk saat ini, halaman detail bersifat placeholder agar navigasi dari homepage dan navbar tetap berfungsi tanpa 404.
          </p>
        </section>
      </article>
    </main>
  );
}
