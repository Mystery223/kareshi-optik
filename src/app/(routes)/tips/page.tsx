import Link from "next/link";

const posts = [
  {
    slug: "memilih-frame-sesuai-bentuk-wajah",
    title: "5 Tips Memilih Frame Sesuai Bentuk Wajah",
    excerpt: "Panduan lengkap menemukan kacamata yang paling melengkapi karakteristik wajah Anda.",
    category: "Style Guide",
    date: "14 Feb 2024",
  },
  {
    slug: "lensa-anti-radiasi-blue-light",
    title: "Mengenal Lensa Anti-Radiasi Blue Light",
    excerpt: "Pahami bagaimana teknologi lensa terbaru melindungi mata Anda dari paparan gadget.",
    category: "Eye Health",
    date: "10 Feb 2024",
  },
  {
    slug: "tren-eyewear-editorial-2024",
    title: "Eksplorasi Tren Eyewear Editorial 2024",
    excerpt: "Melihat lebih dekat gaya kacamata yang mendominasi runway tahun ini.",
    category: "Trends",
    date: "05 Feb 2024",
  },
];

export default function TipsPage() {
  return (
    <main className="min-h-screen bg-paper pt-32 pb-24">
      <section className="container mx-auto px-6 space-y-14">
        <header className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose">Journal & Tips</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-ink">
            Artikel <span className="italic text-ink-mid">Kareshi</span>
          </h1>
          <p className="max-w-2xl text-ink-mid">
            Kumpulan tips kesehatan mata, style guide, dan insight tren eyewear untuk kebutuhan harian Anda.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="rounded-3xl border border-border bg-paper-mid/40 p-8 transition-colors hover:border-rose/40">
              <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                <span className="text-rose">{post.category}</span>
                <span className="h-1 w-1 rounded-full bg-border-dark" />
                <span className="text-ink-light">{post.date}</span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-ink mb-4 leading-tight">{post.title}</h2>
              <p className="text-sm text-ink-mid leading-relaxed mb-6">{post.excerpt}</p>

              <Link
                href={`/tips/${post.slug}`}
                className="inline-flex text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:text-rose"
              >
                Baca Artikel →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
