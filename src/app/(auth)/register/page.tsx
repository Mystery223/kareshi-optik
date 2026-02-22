"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import RevealWrapper from "@/components/ui/RevealWrapper";

const registerSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || "Gagal mendaftar");
            }

            toast.success("Pendaftaran berhasil! Silakan login.");
            router.push("/login");
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen grid lg:grid-cols-2 bg-ink">
            {/* Right Side: Form (Mobile first or Left on Desktop for Variety) */}
            <div className="flex items-center justify-center p-8 lg:p-24 bg-paper order-2 lg:order-1">
                <div className="w-full max-w-sm space-y-12">
                    <RevealWrapper className="space-y-4">
                        <Link href="/" className="inline-block">
                            <h1 className="font-serif text-3xl font-bold text-ink">Kareshi.</h1>
                        </Link>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-ink">Buat Akun Baru</h3>
                            <p className="text-ink-mid">Bergabung dengan komunitas eksklusif Kareshi Optik.</p>
                        </div>
                    </RevealWrapper>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <RevealWrapper delay={0.2} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Full Name</label>
                                <input
                                    {...register("name")}
                                    className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-rose transition-colors text-ink"
                                    placeholder="John Doe"
                                />
                                {errors.name && <p className="text-xs text-rose mt-1">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Email Address</label>
                                <input
                                    {...register("email")}
                                    className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-rose transition-colors text-ink"
                                    placeholder="nama@email.com"
                                />
                                {errors.email && <p className="text-xs text-rose mt-1">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Password</label>
                                <div className="relative">
                                    <input
                                        {...register("password")}
                                        type={showPassword ? "text" : "password"}
                                        className="w-full bg-transparent border-b border-border py-3 pr-10 focus:outline-none focus:border-rose transition-colors text-ink"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-ink-light hover:text-ink transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                <path d="M3 3l18 18" />
                                                <path d="M10.6 10.6A2 2 0 0013.4 13.4" />
                                                <path d="M9.9 5.1A10.9 10.9 0 0112 5c4.5 0 8.4 2.8 10 7-0.6 1.4-1.5 2.7-2.6 3.8" />
                                                <path d="M6.2 6.2C4.8 7.3 3.7 8.9 3 12c1.6 4.2 5.5 7 10 7 1.1 0 2.1-.2 3.1-.5" />
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-rose mt-1">{errors.password.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        {...register("confirmPassword")}
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="w-full bg-transparent border-b border-border py-3 pr-10 focus:outline-none focus:border-rose transition-colors text-ink"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        aria-label={showConfirmPassword ? "Sembunyikan konfirmasi kata sandi" : "Tampilkan konfirmasi kata sandi"}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-ink-light hover:text-ink transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                <path d="M3 3l18 18" />
                                                <path d="M10.6 10.6A2 2 0 0013.4 13.4" />
                                                <path d="M9.9 5.1A10.9 10.9 0 0112 5c4.5 0 8.4 2.8 10 7-0.6 1.4-1.5 2.7-2.6 3.8" />
                                                <path d="M6.2 6.2C4.8 7.3 3.7 8.9 3 12c1.6 4.2 5.5 7 10 7 1.1 0 2.1-.2 3.1-.5" />
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-xs text-rose mt-1">{errors.confirmPassword.message}</p>}
                            </div>
                        </RevealWrapper>

                        <RevealWrapper delay={0.4} className="space-y-6">
                            <button
                                disabled={isLoading}
                                className="w-full bg-ink text-paper py-5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-rose active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Memproses..." : "Daftar Akun"}
                            </button>

                            <div className="text-center text-[10px] uppercase tracking-widest text-ink-light">
                                Sudah punya akun?{" "}
                                <Link href="/login" className="text-rose font-bold hover:underline">
                                    Masuk Saja
                                </Link>
                            </div>
                        </RevealWrapper>
                    </form>
                </div>
            </div>

            {/* Left Side: Visual (Right on Desktop for Variety) */}
            <div className="relative hidden lg:block overflow-hidden order-1 lg:order-2">
                <Image
                    src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2000"
                    alt="Eye Examination"
                    fill
                    className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/20" />
                <div className="absolute bottom-12 right-12 max-w-md text-right space-y-4">
                    <RevealWrapper>
                        <h2 className="font-serif text-5xl text-paper leading-tight">
                            Personalized <span className="italic">Care.</span>
                        </h2>
                        <p className="text-paper/60 text-sm tracking-widest uppercase">
                            Join Our Visionary Community
                        </p>
                    </RevealWrapper>
                </div>
            </div>
        </main>
    );
}
