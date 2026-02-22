"use client";

import { motion } from "framer-motion";

const brands = [
    "RAY-BAN", "OAKLEY", "GUCCI", "TOM FORD", "OLIVER PEOPLES",
    "PRADA", "DIOR", "GENTLE MONSTER", "CHANEL", "BURBERRY"
];

export default function MarqueeBar() {
    return (
        <section className="py-12 bg-ink overflow-hidden border-y border-ink-mid">
            <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                <div className="flex gap-20 px-10">
                    {brands.map((brand, i) => (
                        <div key={i} className="flex items-center gap-20">
                            <span className="text-xs font-black uppercase tracking-[0.5em] text-paper/30">
                                {brand}
                            </span>
                            <div className="h-1.5 w-1.5 rounded-full bg-rose/40" />
                        </div>
                    ))}
                </div>

                {/* Duplicate for seamless loop */}
                <div className="flex gap-20 px-10">
                    {brands.map((brand, i) => (
                        <div key={`dup-${i}`} className="flex items-center gap-20">
                            <span className="text-xs font-black uppercase tracking-[0.5em] text-paper/30">
                                {brand}
                            </span>
                            <div className="h-1.5 w-1.5 rounded-full bg-rose/40" />
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
