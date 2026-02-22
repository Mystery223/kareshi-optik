"use client";

import RevealWrapper from "@/components/ui/RevealWrapper";
import { motion } from "framer-motion";

export default function AboutSection() {
    return (
        <section className="py-32 bg-paper overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Image Side */}
                    <div className="relative order-2 lg:order-1">
                        <RevealWrapper direction="left">
                            <div className="relative aspect-square max-w-lg mx-auto">
                                <div className="absolute inset-0 bg-rose/10 rounded-[60px] translate-x-10 translate-y-10 -z-10" />
                                <div className="h-full w-full bg-paper-mid rounded-[60px] overflow-hidden border border-border/50 flex items-center justify-center p-20">
                                    <span className="font-serif text-[200px] text-ink/5 font-black italic select-none">K</span>
                                </div>

                                {/* Floating Badge */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute -top-10 -right-10 h-32 w-32 bg-ink rounded-full flex items-center justify-center border-4 border-paper group"
                                >
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-rose tracking-widest uppercase">Since</p>
                                        <p className="font-serif text-2xl font-bold text-paper italic">2024</p>
                                    </div>
                                </motion.div>
                            </div>
                        </RevealWrapper>
                    </div>

                    {/* Text Side */}
                    <div className="space-y-8 order-1 lg:order-2">
                        <RevealWrapper>
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose">
                                Our Philosophy
                            </span>
                        </RevealWrapper>

                        <RevealWrapper delay={0.2}>
                            <h2 className="font-serif text-5xl font-bold text-ink leading-tight">
                                Melihat Dunia dengan <br /><span className="italic text-ink-mid underline decoration-rose/30">Cara yang Berbeda</span>
                            </h2>
                        </RevealWrapper>

                        <RevealWrapper delay={0.4} className="space-y-6 text-ink-mid leading-relaxed">
                            <p>
                                Kareshi Optik lahir dari visi untuk menyatukan presisi optik medis dengan estetika fashion modern. Kami percaya bahwa kacamata bukan sekadar alat bantu penglihatan, melainkan perpanjangan dari identitas diri Anda.
                            </p>
                            <p>
                                Setiap frame dalam koleksi kami dikurasi secara manual dari pengrajin terbaik dunia, memastikan standar kualitas dan kenyamanan yang tidak tertandingi bagi setiap pelanggan yang masuk melalui pintu kami.
                            </p>
                        </RevealWrapper>

                        <RevealWrapper delay={0.6} className="pt-6">
                            <div className="flex gap-12">
                                <div>
                                    <h4 className="font-serif text-3xl font-bold text-ink mb-1 italic">Premium</h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-ink-light leading-none">Curation</p>
                                </div>
                                <div>
                                    <h4 className="font-serif text-3xl font-bold text-ink mb-1 italic">Expert</h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-ink-light leading-none">Diagnostic</p>
                                </div>
                            </div>
                        </RevealWrapper>
                    </div>
                </div>
            </div>
        </section>
    );
}
