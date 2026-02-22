"use client";

import RevealWrapper from "@/components/ui/RevealWrapper";
import Link from "next/link";
import Image from "next/image";

const categories = [
    { name: "Koleksi Pria", slug: "pria", span: "lg:col-span-2 lg:row-span-2", image: "/images/categories/pria.jpg", position: "object-center" },
    { name: "Koleksi Wanita", slug: "wanita", span: "lg:col-span-1 lg:row-span-1", image: "/images/categories/wanita.jpg", position: "object-center" },
    { name: "Sunglasses", slug: "sunglasses", span: "lg:col-span-1 lg:row-span-2", image: "/images/categories/sunglasses.jpg", position: "object-center" },
    { name: "Koleksi Anak", slug: "anak", span: "lg:col-span-1 lg:row-span-1", image: "/images/categories/anak.jpg", position: "object-center" },
    { name: "Sport Edition", slug: "sport", span: "lg:col-span-2 lg:row-span-1", image: "/images/categories/sport.jpg", position: "object-center" },
];

export default function CollectionGrid() {
    return (
        <section className="py-32 bg-paper">
            <div className="container mx-auto px-6">
                <RevealWrapper className="mb-20 text-center max-w-2xl mx-auto space-y-4">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose">
                        Selected Categories
                    </span>
                    <h2 className="font-serif text-5xl font-bold text-ink">
                        Eksplorasi Katalog <span className="italic text-ink-mid">Kareshi</span>
                    </h2>
                    <p className="text-ink-mid">
                        Temukan bingkai yang sempurna untuk karakteristik wajah dan gaya hidup unik Anda.
                    </p>
                </RevealWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[240px]">
                    {categories.map((cat, i) => (
                        <RevealWrapper
                            key={i}
                            delay={i * 0.1}
                            className={cat.span}
                        >
                            <Link
                                href={`/koleksi?category=${cat.slug}`}
                                className="group relative block h-full w-full overflow-hidden rounded-[32px] border border-border/50"
                            >
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                                    className={`transition-transform duration-700 group-hover:scale-110 ${cat.position}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/20 to-transparent" />

                                {/* Content */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <h3 className="font-serif text-2xl font-bold text-paper group-hover:text-rose-light transition-colors">
                                        {cat.name}
                                    </h3>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-paper/80 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                            Lihat Semua Koleksi →
                                        </p>
                                    </div>
                                </div>

                                {/* Overlay Accent */}
                                <div className="absolute top-6 right-6 h-10 w-10 rounded-full bg-paper/85 text-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-lg font-bold">↗</span>
                                </div>
                            </Link>
                        </RevealWrapper>
                    ))}
                </div>

                <RevealWrapper delay={0.6} className="mt-20 text-center">
                    <Link
                        href="/koleksi"
                        className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-ink group"
                    >
                        Semua Produk
                        <span className="h-px w-12 bg-rose transition-all group-hover:w-20" />
                    </Link>
                </RevealWrapper>
            </div>
        </section>
    );
}
