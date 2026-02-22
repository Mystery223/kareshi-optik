import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || "6281234567890";
    const storeAddress = "Jl. Kota Bambu Utara I No.4, RT.6/RW.1, Kota Bambu Utara, Kec. Palmerah, Kota Jakarta Barat, DKI Jakarta 11420";
    const encodedAddress = encodeURIComponent(storeAddress);
    const mapsViewUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    const mapsDirectionUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    const mapsEmbedUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
    const socialLinks = [
        {
            name: "Instagram",
            href: "https://instagram.com/kareshioptik",
            icon: (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                    <circle cx="12" cy="12" r="4.2" />
                    <circle cx="17.6" cy="6.4" r="1" fill="currentColor" stroke="none" />
                </svg>
            ),
        },
        {
            name: "Facebook",
            href: "https://facebook.com/kareshioptik",
            icon: (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M13.5 8.5V6.9c0-.7.4-1.1 1.2-1.1h1.7V3h-2.7c-2.4 0-3.7 1.4-3.7 3.7v1.8H8v2.8h2v7.7h3.5v-7.7h2.6l.4-2.8h-3Z" />
                </svg>
            ),
        },
        {
            name: "WhatsApp",
            href: `https://wa.me/${waNumber}`,
            icon: (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3 21l4.8-1.3A8.8 8.8 0 1 0 12 3.2Zm0 15.9c-1.3 0-2.5-.3-3.6-1l-.3-.2-2.8.8.8-2.7-.2-.3a6.6 6.6 0 1 1 6.1 3.4Zm3.6-4.9c-.2-.1-1.4-.7-1.6-.7-.2-.1-.3-.1-.5.1l-.7.8c-.1.1-.2.2-.4.1a5.5 5.5 0 0 1-2.7-2.4c-.1-.2 0-.3.1-.4l.5-.6c.1-.1.1-.3.2-.4 0-.1 0-.2 0-.3 0-.1-.5-1.4-.7-1.9-.2-.5-.4-.4-.5-.4h-.4c-.1 0-.3 0-.4.2-.1.1-.6.6-.6 1.5s.6 1.7.6 1.8c.1.1 1.2 2 3 2.8 1.8.8 1.8.6 2.2.6.4 0 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.2Z" />
                </svg>
            ),
        },
    ];

    return (
        <footer className="bg-ink py-20 text-paper-mid overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link href="/" className="block">
                            <span className="font-serif text-3xl font-bold tracking-tight text-paper">
                                Kareshi<span className="text-rose italic">.</span>Optik
                            </span>
                        </Link>
                        <p className="max-w-xs text-sm leading-relaxed text-ink-light">
                            Mendefinisikan ulang cara Anda melihat dunia melalui perpaduan estetika editorial dan teknologi optik terkini.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-mid text-xs transition-all hover:bg-paper hover:text-ink"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="mb-8 font-serif text-lg font-bold text-paper">Eksplorasi</h4>
                        <ul className="space-y-4 text-sm text-ink-light">
                            <li><Link href="/koleksi" className="hover:text-rose transition-colors">Koleksi Frame</Link></li>
                            <li><Link href="/layanan" className="hover:text-rose transition-colors">Layanan Optik</Link></li>
                            <li><Link href="/tentang" className="hover:text-rose transition-colors">Cerita Kami</Link></li>
                            <li><Link href="/tips" className="hover:text-rose transition-colors">Tips Mata</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="mb-8 font-serif text-lg font-bold text-paper">Layanan</h4>
                        <ul className="space-y-4 text-sm text-ink-light">
                            <li>Pemeriksaan Mata Rutin</li>
                            <li>Konsultasi Lensa Kontak</li>
                            <li>Servis Kacamata</li>
                            <li>Pemeriksaan Mata Anak</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-6">
                        <h4 className="mb-2 font-serif text-lg font-bold text-paper">Kunjungi Kami</h4>
                        <div className="text-sm leading-relaxed text-ink-light">
                            <p>Jl. Kota Bambu Utara I No.4, RT.6/RW.1</p>
                            <p>Kota Bambu Utara, Kec. Palmerah</p>
                            <p>Kota Jakarta Barat, DKI Jakarta 11420</p>
                        </div>
                        <div className="space-y-3">
                            <div className="overflow-hidden rounded-2xl border border-ink-mid/60 bg-ink-mid/10">
                                <iframe
                                    title="Peta Lokasi Kareshi Optik"
                                    src={mapsEmbedUrl}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="h-40 w-full"
                                />
                            </div>
                            <div className="flex gap-2">
                                <a
                                    href={mapsViewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-ink-mid px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-paper-mid transition-colors hover:border-rose hover:text-rose"
                                >
                                    Buka Maps
                                </a>
                                <a
                                    href={mapsDirectionUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-rose/90 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-paper transition-colors hover:bg-rose"
                                >
                                    Rute
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 border-t border-ink-mid pt-8 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                    <p className="text-[10px] uppercase tracking-widest text-ink-light">
                        © {currentYear} KAreshi Optik. All Rights Reserved.
                    </p>
                    <div className="flex space-x-8 text-[10px] uppercase tracking-widest text-ink-light">
                        <Link href="/privacy" className="hover:text-paper">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-paper">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
