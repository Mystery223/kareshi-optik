"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { signOut, useSession } from "next-auth/react";
import { getRoleAvatar } from "@/lib/utils/role-avatar";
import { type UserRole } from "@/types";

const menuItems = [
    { name: "Overview", href: "/admin", icon: "📊" },
    { name: "Appointments", href: "/admin/appointments", icon: "📅" },
    { name: "Orders", href: "/admin/orders", icon: "🛍️" },
    { name: "Products", href: "/admin/produk", icon: "👓" },
    { name: "Users", href: "/admin/users", icon: "🛡️", adminOnly: true },
    { name: "Customers", href: "/admin/customers", icon: "👥" },
    { name: "Blog", href: "/admin/blog", icon: "✍️" },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const displayName = session?.user?.name || "Admin";
    const roleLabel = session?.user?.role === "admin" ? "Administrator" : "Staff";
    const avatarSrc = getRoleAvatar(session?.user?.role as UserRole | undefined, session?.user?.image);
    const isAdminRole = session?.user?.role === "admin";
    const visibleMenuItems = menuItems.filter((item) => !item.adminOnly || isAdminRole);

    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = "";
            return;
        }
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <>
            <button
                type="button"
                aria-label={isOpen ? "Tutup menu admin" : "Buka menu admin"}
                aria-expanded={isOpen}
                onClick={() => setIsOpen((prev) => !prev)}
                className={cn(
                    "fixed left-4 top-4 z-[70] inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors md:hidden",
                    isOpen
                        ? "border-white/20 bg-ink text-paper"
                        : "border-border bg-paper/95 text-ink shadow-md backdrop-blur"
                )}
            >
                <span className="text-xl leading-none">{isOpen ? "✕" : "☰"}</span>
            </button>

            <div
                onClick={() => setIsOpen(false)}
                className={cn(
                    "fixed inset-0 z-40 bg-black/55 transition-opacity md:hidden",
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                )}
            />

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-[86vw] max-w-72 min-h-dvh bg-ink text-paper flex flex-col overflow-y-auto py-6 transition-transform duration-300 md:sticky md:top-0 md:h-screen md:min-h-0 md:w-72 md:max-w-none md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="px-10 mb-10 pt-12 md:pt-0">
                    <Link href="/admin" className="group" onClick={() => setIsOpen(false)}>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-rose mb-1">Kareshi</p>
                        <h2 className="font-serif text-2xl font-bold tracking-tight">
                            Optik <span className="italic text-paper-mid group-hover:text-rose transition-colors">Admin</span>
                        </h2>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2 min-h-0">
                    {visibleMenuItems.map((item) => {
                        const isActive = item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname === item.href || pathname.startsWith(`${item.href}/`);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300",
                                    isActive
                                        ? "bg-paper text-ink shadow-xl shadow-black/20"
                                        : "text-paper-mid hover:text-paper hover:bg-white/5"
                                )}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-rose"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-10 mt-6 border-t border-white/10 pt-6 shrink-0">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-paper-mid mb-2">Logged in as</p>
                    <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-rose/30 bg-white/10">
                            <Image
                                src={avatarSrc}
                                alt={`Avatar ${roleLabel}`}
                                fill
                                sizes="32px"
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-paper truncate max-w-[120px]">{displayName}</p>
                            <p className="text-[8px] text-paper-mid uppercase tracking-tighter">{roleLabel}</p>
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                        <Link
                            href="/admin/profile"
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "rounded-xl border px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] transition-colors",
                                pathname.startsWith("/admin/profile")
                                    ? "border-rose/60 text-rose"
                                    : "border-white/20 text-paper-mid hover:border-rose/60 hover:text-rose"
                            )}
                        >
                            Profile
                        </Link>
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="rounded-xl bg-paper text-ink px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-rose hover:text-paper"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
