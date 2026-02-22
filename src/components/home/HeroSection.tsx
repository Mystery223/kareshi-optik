"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import RevealWrapper from "@/components/ui/RevealWrapper";

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-paper pt-20">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-paper-mid -z-10" />
            <div className="absolute top-1/4 left-10 w-64 h-64 bg-rose/5 rounded-full blur-3xl -z-10 animate-pulse" />

            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                {/* Left Content */}
                <div className="space-y-10 z-10">
                    <RevealWrapper direction="none">
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose">
                            EST. 2024 — Premium Optical
                        </span>
                    </RevealWrapper>

                    <div className="space-y-4">
                        <RevealWrapper delay={0.2}>
                            <h1 className="font-serif text-6xl md:text-8xl font-bold leading-[1.1] text-ink">
                                Definisikan <br />
                                <span className="italic text-rose">Visi</span>{" "}
                                <span>Anda</span>
                                <span className="text-rose">.</span>
                            </h1>
                        </RevealWrapper>

                        <RevealWrapper delay={0.4}>
                            <p className="max-w-md text-ink-mid text-lg leading-relaxed">
                                Koleksi kurasi kacamata editorial yang memadukan estetika kontemporer dengan presisi optik kelas dunia.
                            </p>
                        </RevealWrapper>
                    </div>

                    <RevealWrapper delay={0.6}>
                        <div className="flex flex-wrap gap-6 pt-4">
                            <Link
                                href="/koleksi"
                                className="group relative overflow-hidden bg-ink px-10 py-5 text-paper rounded-full transition-all hover:pr-14 active:scale-95"
                            >
                                <span className="relative z-10 font-bold uppercase tracking-widest text-xs">Jelajahi Koleksi</span>
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 transition-all group-hover:opacity-100 group-hover:right-8">→</span>
                            </Link>

                            <Link
                                href="/appointment"
                                className="px-10 py-5 rounded-full border border-border group hover:border-ink transition-colors flex items-center gap-2"
                            >
                                <span className="font-bold uppercase tracking-widest text-xs text-ink-mid group-hover:text-ink">Booking Periksa</span>
                                <div className="h-2 w-2 rounded-full bg-rose animate-pulse" />
                            </Link>
                        </div>
                    </RevealWrapper>

                    {/* Featured Brands Shortlist */}
                    <RevealWrapper delay={0.8} className="pt-10 flex items-center gap-8">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-ink-light">Curated Brands:</span>
                        <div className="flex gap-6 opacity-40">
                            <span className="font-serif italic text-lg text-ink font-bold">Ray-Ban</span>
                            <span className="font-serif italic text-lg text-ink font-bold">Oakley</span>
                            <span className="font-serif italic text-lg text-ink font-bold">Gucci</span>
                        </div>
                    </RevealWrapper>
                </div>

                {/* Right Illustration/Image */}
                <RevealWrapper direction="none" delay={0.4} className="relative hidden lg:block">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[40px] shadow-2xl skew-y-1">
                        <Image
                            src="/images/hero/hero-optical.jpg"
                            alt="Premium eyewear visual"
                            fill
                            priority
                            sizes="(min-width: 1024px) 50vw, 100vw"
                            className="object-cover object-center"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-ink/20 to-transparent" />
                    </div>

                    {/* Floating Element */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-8 -left-12 bg-paper p-8 shadow-xl rounded-2xl border border-border/50 max-w-[200px]"
                    >
                        <p className="font-serif italic text-rose text-2xl mb-2">99.9%</p>
                        <p className="text-[10px] uppercase tracking-widest font-bold leading-tight">Presisi Lensa Terbaik Untuk Mata Anda</p>
                    </motion.div>
                </RevealWrapper>
            </div>
        </section>
    );
}
