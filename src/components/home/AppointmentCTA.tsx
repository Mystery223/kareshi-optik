"use client";

import RevealWrapper from "@/components/ui/RevealWrapper";
import Link from "next/link";

export default function AppointmentCTA() {
    return (
        <section className="py-32 px-6">
            <div className="container mx-auto">
                <div className="bg-ink rounded-[60px] p-12 md:p-24 overflow-hidden relative">
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-rose/10 skew-x-12 translate-x-10" />

                    <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                        <RevealWrapper className="space-y-8">
                            <h2 className="font-serif text-5xl md:text-7xl font-bold text-paper leading-[1.1]">
                                Siap Untuk Melihat <br />
                                <span className="italic text-rose">Lebih Jelas?</span>
                            </h2>
                            <p className="text-ink-light text-lg max-w-sm">
                                Booking jadwal periksa mata Anda hari ini dan rasakan standar pelayanan optik yang berbeda.
                            </p>
                        </RevealWrapper>

                        <RevealWrapper delay={0.2} className="flex lg:justify-end">
                            <Link
                                href="/appointment"
                                className="group inline-flex h-24 w-24 md:h-40 md:w-40 items-center justify-center rounded-full bg-paper text-ink transition-all hover:bg-rose hover:text-paper hover:scale-110 active:scale-95"
                            >
                                <div className="text-center">
                                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Book</p>
                                    <p className="font-serif text-xl md:text-3xl font-bold italic h-6 md:h-10">Now</p>
                                </div>
                            </Link>
                        </RevealWrapper>
                    </div>
                </div>
            </div>
        </section>
    );
}
