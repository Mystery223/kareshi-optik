"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import RevealWrapper from "@/components/ui/RevealWrapper";
import { motion } from "framer-motion";

import { generateWhatsAppLink, WA_TEMPLATES } from "@/lib/utils/whatsapp";

function BookingSuccessContent() {
    const searchParams = useSearchParams();
    const code = searchParams.get("code") || "KRS-XXXX";
    const name = searchParams.get("name") || "";
    const date = searchParams.get("date") || "";
    const time = searchParams.get("time") || "";

    const waLink = generateWhatsAppLink(
        process.env.NEXT_PUBLIC_WA_NUMBER || "6281234567890",
        WA_TEMPLATES.CONFIRM_BOOKING(code, name, date, time)
    );

    return (
        <main className="min-h-screen bg-paper flex items-center justify-center py-32 px-6">
            <div className="max-w-xl w-full text-center space-y-12">
                <RevealWrapper className="flex flex-col items-center gap-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 10, stiffness: 60 }}
                        className="h-32 w-32 rounded-full bg-rose flex items-center justify-center text-paper text-6xl shadow-2xl shadow-rose/20"
                    >
                        ✓
                    </motion.div>
                    <h1 className="font-serif text-5xl md:text-7xl font-bold text-ink">
                        Booking <span className="italic text-rose">Berhasil!</span>
                    </h1>
                    <p className="text-ink-mid text-lg leading-relaxed">
                        Terima kasih telah mempercayakan kesehatan mata Anda kepada Kareshi Optik. Kami telah mencatat janji temu Anda.
                    </p>
                </RevealWrapper>

                <RevealWrapper delay={0.4} className="bg-paper-mid border border-border/50 rounded-[40px] p-12 space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-ink-light">Booking Code Anda:</p>
                    <h2 className="font-serif text-5xl md:text-6xl font-bold text-ink select-all">
                        {code}
                    </h2>
                    <p className="text-xs text-ink-light px-8">
                        Gunakan kode ini untuk pengecekan status janji temu Anda di masa mendatang.
                    </p>

                    <div className="pt-6">
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] text-paper rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                        >
                            <span>Hubungi via WhatsApp</span>
                            <span className="text-lg">↗</span>
                        </a>
                    </div>
                </RevealWrapper>

                <RevealWrapper delay={0.6} className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link href="/koleksi" className="px-12 py-5 bg-ink text-paper rounded-full text-xs font-bold uppercase tracking-widest hover:bg-rose transition-colors shadow-xl shadow-ink/10">
                        Lanjut Belanja Koleksi
                    </Link>
                    <Link href="/" className="px-12 py-5 border border-border rounded-full text-xs font-bold uppercase tracking-widest text-ink-mid hover:text-ink transition-colors">
                        Kembali ke Home
                    </Link>
                </RevealWrapper>

                <RevealWrapper delay={0.8} className="pt-8 italic text-xs text-ink-light">
                    Pengingat jadwal akan dikirimkan melalui WhatsApp dalam 1x24 jam.
                </RevealWrapper>
            </div>
        </main>
    );
}

export default function BookingSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-paper" />}>
            <BookingSuccessContent />
        </Suspense>
    );
}
