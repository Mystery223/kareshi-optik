"use client";

import RevealWrapper from "@/components/ui/RevealWrapper";

const featuredBrands = [
    { name: "Ray-Ban", country: "Italy" },
    { name: "Oakley", country: "USA" },
    { name: "Gucci", country: "Italy" },
    { name: "Tom Ford", country: "USA" },
    { name: "Oliver Peoples", country: "USA" },
    { name: "Prada", country: "Italy" },
];

export default function BrandsSection() {
    return (
        <section className="py-24 bg-paper-mid overflow-hidden">
            <div className="container mx-auto px-6">
                <RevealWrapper className="mb-16 flex flex-col md:flex-row items-end justify-between gap-8">
                    <div className="space-y-4">
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose">
                            Global Partners
                        </span>
                        <h2 className="font-serif text-4xl font-bold text-ink">
                            Hanya Memberikan <span className="italic">Yang Terbaik</span>
                        </h2>
                    </div>
                    <p className="text-sm text-ink-light max-w-xs md:text-right">
                        Bekerja sama dengan pemimpin industri eyewear global untuk menjamin kualitas dan keaslian 100%.
                    </p>
                </RevealWrapper>

                <div className="grid grid-cols-2 lg:grid-cols-6 gap-px bg-border/50 border border-border/50 rounded-3xl overflow-hidden">
                    {featuredBrands.map((brand, i) => (
                        <RevealWrapper
                            key={i}
                            delay={i * 0.05}
                            className="group bg-paper h-40 flex flex-col items-center justify-center p-8 transition-colors hover:bg-paper-mid"
                        >
                            <span className="font-serif text-2xl font-black text-ink/20 group-hover:text-ink transition-all duration-500 group-hover:scale-110 italic">
                                {brand.name}
                            </span>
                            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-ink-light opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                                Origin: {brand.country}
                            </span>
                        </RevealWrapper>
                    ))}
                </div>
            </div>
        </section>
    );
}
