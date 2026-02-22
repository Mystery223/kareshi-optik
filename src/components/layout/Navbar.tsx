"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const navLinks = [
    { name: "Koleksi", href: "/koleksi" },
    { name: "Layanan", href: "/layanan" },
    { name: "Tentang", href: "/tentang" },
    { name: "Tips", href: "/tips" },
];

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <nav
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-500 ease-out",
                isScrolled
                    ? "bg-paper/80 py-4 backdrop-blur-md border-b border-border/50"
                    : "bg-transparent py-8"
            )}
        >
            <div className="container mx-auto flex items-center justify-between px-6">
                {/* Logo */}
                <Link href="/" className="group flex items-center space-x-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-500 group-hover:rotate-180">
                        <span className="font-serif text-xl font-bold italic">K</span>
                    </div>
                    <span className="font-serif text-2xl font-bold tracking-tight text-ink">
                        Kareshi<span className="text-rose italic">.</span>Optik
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center space-x-10 md:flex">
                    {navLinks.map((link) => (
                        <motion.div
                            key={link.name}
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Link
                                href={link.href}
                                className={cn(
                                    "group relative text-sm font-medium tracking-wide transition-colors duration-300",
                                    pathname === link.href ? "text-ink" : "text-ink-mid hover:text-ink"
                                )}
                            >
                                {link.name}
                                <span
                                    className={cn(
                                        "absolute -bottom-1 left-0 h-px bg-rose transition-all duration-300",
                                        pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                                    )}
                                />
                            </Link>
                        </motion.div>
                    ))}
                    {session ? (
                        <Link
                            href="/dashboard"
                            className={cn(
                                "group relative text-sm font-medium tracking-wide transition-colors duration-300",
                                pathname.startsWith("/dashboard") ? "text-rose" : "text-ink-mid hover:text-rose"
                            )}
                        >
                            Dashboard
                            <span
                                className={cn(
                                    "absolute -bottom-1 left-0 h-px bg-rose transition-all duration-300",
                                    pathname.startsWith("/dashboard") ? "w-full" : "w-0 group-hover:w-full"
                                )}
                            />
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className={cn(
                                "group relative text-sm font-medium tracking-wide transition-colors duration-300",
                                pathname === "/login" ? "text-ink" : "text-ink-mid hover:text-ink"
                            )}
                        >
                            Login
                            <span
                                className={cn(
                                    "absolute -bottom-1 left-0 h-px bg-rose transition-all duration-300",
                                    pathname === "/login" ? "w-full" : "w-0 group-hover:w-full"
                                )}
                            />
                        </Link>
                    )}
                    <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                    <Link
                        href="/appointment"
                        className="rounded-full bg-ink px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-paper transition-all duration-300 hover:bg-rose hover:shadow-lg hover:shadow-rose/20 active:scale-95"
                    >
                        Booking Janji
                    </Link>
                    </motion.div>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="flex h-10 w-10 flex-col items-center justify-center space-y-1.5 md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
                    aria-expanded={mobileMenuOpen}
                >
                    <motion.span
                        className="h-0.5 w-6 bg-ink"
                        animate={mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                    />
                    <motion.span
                        className="h-0.5 w-6 bg-ink"
                        animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    />
                    <motion.span
                        className="h-0.5 w-6 bg-ink"
                        animate={mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                    />
                </button>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="mx-6 mt-3 rounded-2xl border border-border/70 bg-paper/95 p-4 shadow-xl backdrop-blur md:hidden"
                    >
                        <div className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={closeMobileMenu}
                                    className={cn(
                                        "rounded-xl px-3 py-2.5 text-sm transition-colors duration-200",
                                        pathname === link.href
                                            ? "bg-rose-pale text-rose"
                                            : "text-ink-mid hover:bg-paper-mid hover:text-ink"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <Link
                                href={session ? "/dashboard" : "/login"}
                                onClick={closeMobileMenu}
                                className={cn(
                                    "rounded-xl px-3 py-2.5 text-sm transition-colors duration-200",
                                    (session && pathname.startsWith("/dashboard")) || pathname === "/login"
                                        ? "bg-rose-pale text-rose"
                                        : "text-ink-mid hover:bg-paper-mid hover:text-ink"
                                )}
                            >
                                {session ? "Dashboard" : "Login"}
                            </Link>

                            <Link
                                href="/appointment"
                                onClick={closeMobileMenu}
                                className="mt-2 rounded-full bg-ink px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-paper transition-colors duration-200 hover:bg-rose"
                            >
                                Booking Janji
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
