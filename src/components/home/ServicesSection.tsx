"use client";

import RevealWrapper from "@/components/ui/RevealWrapper";

const services = [
    {
        title: "Pemeriksaan Mata Rutin",
        description: "Evaluasi kesehatan mata menyeluruh menggunakan teknologi diagnostik digital terbaru.",
        icon: "👁️",
    },
    {
        title: "Konsultasi Lensa Kontak",
        description: "Fitting dan konsultasi ahli untuk kenyamanan maksimal penggunaan lensa kontak.",
        icon: "🔬",
    },
    {
        title: "Servis & Perbaikan",
        description: "Penyetelan frame, penggantian nosepad, dan pembersihan ultrasonik profesional.",
        icon: "⚙️",
    },
    {
        title: "Pemeriksaan Mata Anak",
        description: "Layanan spesialis ramah anak untuk memastikan penglihatan si kecil berkembang optimal.",
        icon: "🧸",
    },
];

export default function ServicesSection() {
    return (
        <section className="py-32 bg-paper-warm/30 relative">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-3 gap-16 items-start">
                    {/* Header */}
                    <RevealWrapper className="lg:sticky lg:top-40 space-y-6">
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose">
                            Expert Services
                        </span>
                        <h2 className="font-serif text-5xl font-bold text-ink leading-tight">
                            Layanan <br /><span className="italic text-rose">Komprehensif</span> Kami
                        </h2>
                        <p className="text-ink-mid max-w-sm">
                            Kami menggabungkan keahlian medis dengan perhatian personal untuk memberikan solusi penglihatan terbaik bagi Anda.
                        </p>
                    </RevealWrapper>

                    {/* Service Grid */}
                    <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
                        {services.map((service, i) => (
                            <RevealWrapper
                                key={i}
                                delay={i * 0.1}
                                className="group p-10 bg-paper rounded-[40px] border border-border/40 hover:border-rose/30 hover:shadow-2xl hover:shadow-rose/10 transition-all duration-500"
                            >
                                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">{service.icon}</div>
                                <h3 className="font-serif text-xl font-bold text-ink mb-4 group-hover:text-rose transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-sm text-ink-light leading-relaxed">
                                    {service.description}
                                </p>
                                <div className="mt-8 overflow-hidden h-px bg-border group-hover:bg-rose transition-colors relative">
                                    <div className="absolute inset-0 bg-ink transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                                </div>
                            </RevealWrapper>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
