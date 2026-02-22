"use client";

import AnimatedCounter from "@/components/ui/AnimatedCounter";
import RevealWrapper from "@/components/ui/RevealWrapper";

const stats = [
    { label: "Tahun Pengalaman", value: 12, suffix: "+" },
    { label: "Pelanggan Puas", value: 8500, suffix: "+" },
    { label: "Merek Premium", value: 24, suffix: "" },
    { label: "Optometris Berlisensi", value: 4, suffix: "" },
];

export default function StatsBar() {
    return (
        <section className="py-24 bg-paper-mid border-b border-border">
            <div className="container mx-auto px-6">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <RevealWrapper key={i} delay={i * 0.1} className="text-center space-y-2">
                            <p className="font-serif text-5xl font-bold text-ink">
                                <AnimatedCounter from={0} to={stat.value} />
                                <span className="text-rose">{stat.suffix}</span>
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">
                                {stat.label}
                            </p>
                        </RevealWrapper>
                    ))}
                </div>
            </div>
        </section>
    );
}
