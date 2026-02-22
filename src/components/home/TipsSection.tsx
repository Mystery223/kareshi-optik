"use client";

import RevealWrapper from "@/components/ui/RevealWrapper";
import Link from "next/link";

const posts = [
    {
        title: "5 Tips Memilih Frame Sesuai Bentuk Wajah",
        excerpt: "Panduan lengkap menemukan kacamata yang paling melengkapi karakteristik wajah Anda...",
        category: "Style Guide",
        date: "14 Feb 2024",
    },
    {
        title: "Mengenal Lensa Anti-Radiasi Blue Light",
        excerpt: "Pahami bagaimana teknologi lensa terbaru melindungi mata Anda dari paparan gadget...",
        category: "Eye Health",
        date: "10 Feb 2024",
    },
    {
        title: "Eksplorasi Tren Eyewear Editorial 2024",
        excerpt: "Melihat lebih dekat gaya kacamata yang mendominasi runway tahun ini...",
        category: "Trends",
        date: "05 Feb 2024",
    },
];

export default function TipsSection() {
    return (
        <section className="py-32 bg-paper">
            <div className="container mx-auto px-6">
                <RevealWrapper className="mb-20 flex flex-col md:flex-row items-end justify-between gap-8">
                    <div className="space-y-4">
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose">
                            Journal & Tips
                        </span>
                        <h2 className="font-serif text-5xl font-bold text-ink">
                            Catatan <span className="italic text-ink-mid">Kareshi</span>
                        </h2>
                    </div>
                    <Link
                        href="/tips"
                        className="text-xs font-bold uppercase tracking-widest text-ink hover:text-rose transition-colors"
                    >
                        Lihat Semua Artikel →
                    </Link>
                </RevealWrapper>

                <div className="grid md:grid-cols-3 gap-12">
                    {posts.map((post, i) => (
                        <RevealWrapper key={i} delay={i * 0.1}>
                            <Link href="/tips/placeholder" className="group block space-y-6">
                                <div className="aspect-[16/10] bg-paper-mid rounded-[40px] overflow-hidden border border-border/50 p-10 flex items-center justify-center">
                                    <span className="font-serif text-6xl text-ink/5 italic font-black group-hover:scale-110 transition-transform duration-700">
                                        Tips
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                                        <span className="text-rose">{post.category}</span>
                                        <span className="h-1 w-1 rounded-full bg-border" />
                                        <span className="text-ink-light">{post.date}</span>
                                    </div>
                                    <h3 className="font-serif text-2xl font-bold text-ink group-hover:text-rose transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-ink-mid text-sm leading-relaxed line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </Link>
                        </RevealWrapper>
                    ))}
                </div>
            </div>
        </section>
    );
}
