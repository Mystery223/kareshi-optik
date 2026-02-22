import BookingForm from "@/components/appointment/BookingForm";
import RevealWrapper from "@/components/ui/RevealWrapper";

export const dynamic = "force-dynamic";

export default async function AppointmentPage() {
    return (
        <main className="min-h-screen bg-paper pt-32 pb-48">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header Section */}
                <section className="text-center mb-24 space-y-6">
                    <RevealWrapper>
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose">
                            Reservasi Layanan
                        </span>
                    </RevealWrapper>
                    <RevealWrapper delay={0.2}>
                        <h1 className="font-serif text-6xl md:text-8xl font-bold text-ink leading-tight">
                            Booking <br /><span className="italic text-rose text-5xl md:text-7xl">Jadwal Periksa</span>
                        </h1>
                    </RevealWrapper>
                    <RevealWrapper delay={0.4} className="max-w-xl mx-auto">
                        <p className="text-ink-mid text-lg leading-relaxed">
                            Dapatkan kenyamanan maksimal dengan mengatur jadwal periksa mata Anda terlebih dahulu. Silakan pilih layanan dan waktu yang sesuai.
                        </p>
                    </RevealWrapper>
                </section>

                {/* Booking Form Component */}
                <BookingForm />

                {/* Footer Info */}
                <RevealWrapper delay={0.8} className="mt-24 grid sm:grid-cols-2 gap-12 bg-paper-mid/50 p-12 rounded-[60px] border border-border/30">
                    <div className="space-y-4">
                        <h4 className="font-serif text-xl font-bold text-ink">Lokasi Klinik</h4>
                        <p className="text-sm text-ink-mid leading-relaxed italic">
                            Jl. Kota Bambu Utara I No.4, RT.6/RW.1, <br />
                            Kota Bambu Utara, Kec. Palmerah, Kota Jakarta Barat, DKI Jakarta 11420
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-serif text-xl font-bold text-ink">Jam Operasional</h4>
                        <p className="text-sm text-ink-mid leading-relaxed italic">
                            Senin — Sabtu: 09:00 - 20:00 <br />
                            Minggu: Libur (Penyatelan Frame Tetap Tersedia)
                        </p>
                    </div>
                </RevealWrapper>
            </div>
        </main>
    );
}
