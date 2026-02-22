"use client";

import RevealWrapper from "@/components/ui/RevealWrapper";

const testimonials = [
    {
        name: "Sarah Wijaya",
        role: "Architect",
        comment: "Koleksi frame di Kareshi sangat unik. Saya menemukan bingkai yang benar-benar mewakili kepribadian profesional saya.",
        rating: 5,
    },
    {
        name: "Budi Santoso",
        role: "Creative Director",
        comment: "Layanan periksa matanya sangat detail. Dokter menjelaskan kondisi mata saya dengan sangat komprehensif. Highly recommended!",
        rating: 5,
    },
    {
        name: "Amanda Putri",
        role: "Content Creator",
        comment: "Satu-satunya optik yang punya vibe editorial. Berasa lagi belanja di butik kacamata luar negeri. Keren banget!",
        rating: 5,
    },
];

export default function TestimonialsSection() {
    return (
        <section className="py-32 bg-paper-warm/20">
            <div className="container mx-auto px-6">
                <RevealWrapper className="mb-20 text-center space-y-4">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose">
                        Social Proof
                    </span>
                    <h2 className="font-serif text-5xl font-bold text-ink">
                        Apa Kata <span className="italic">Mereka</span>
                    </h2>
                </RevealWrapper>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <RevealWrapper
                            key={i}
                            delay={i * 0.1}
                            className="bg-paper p-10 rounded-[40px] border border-border/30 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex gap-1 mb-6 text-rose text-sm">
                                {[...Array(t.rating)].map((_, i) => <span key={i}>★</span>)}
                            </div>
                            <p className="text-ink-mid text-lg leading-relaxed mb-10 italic">
                                &ldquo;{t.comment}&rdquo;
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-paper-mid flex items-center justify-center font-serif font-bold text-rose">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold text-ink text-sm uppercase tracking-wider">{t.name}</h4>
                                    <p className="text-[10px] text-ink-light font-medium uppercase tracking-[0.2em]">{t.role}</p>
                                </div>
                            </div>
                        </RevealWrapper>
                    ))}
                </div>
            </div>
        </section>
    );
}
