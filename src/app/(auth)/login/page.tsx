"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import RevealWrapper from "@/components/ui/RevealWrapper";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Email atau password salah");
      } else {
        const session = await getSession();
        const fallbackUrl =
          session?.user?.role === "admin" || session?.user?.role === "staff"
            ? "/admin"
            : "/dashboard";

        toast.success("Login berhasil");
        // Prioritaskan callbackUrl jika ada, jika tidak gunakan fallbackUrl
        router.push(callbackUrl || fallbackUrl);
        router.refresh();
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-ink">
      {/* Left Side: Visual/Branding */}
      <div className="relative hidden lg:block overflow-hidden">
        <Image
          src="/images/login-hero.jpg"
          alt="Luxury Frames"
          fill
          className="object-cover object-center opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/20" />
        <div className="absolute bottom-12 left-12 max-w-md space-y-4">
          <RevealWrapper>
            <h2 className="font-serif text-5xl text-paper leading-tight">
              Elevate Your <span className="italic">Perspective.</span>
            </h2>
            <p className="text-paper/60 text-sm tracking-widest uppercase">
              Kareshi Optik Editorial — Exclusive Access
            </p>
          </RevealWrapper>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex items-center justify-center p-8 lg:p-24 bg-paper">
        <div className="w-full max-w-sm space-y-12">
          <RevealWrapper className="space-y-4">
            <Link href="/" className="inline-block">
              <h1 className="font-serif text-3xl font-bold text-ink">Kareshi.</h1>
            </Link>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-ink">Selamat Datang</h3>
              <p className="text-ink-mid">Masuk ke akun Anda untuk melihat janji temu.</p>
            </div>
          </RevealWrapper>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <RevealWrapper delay={0.2} className="space-y-6">
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
            </RevealWrapper>

            <RevealWrapper delay={0.4} className="space-y-6">
              <button
                disabled={isLoading}
                className="w-full bg-ink text-paper py-5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-rose active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Memproses..." : "Masuk Sekarang"}
              </button>

              <div className="text-center text-[10px] uppercase tracking-widest text-ink-light">
                Belum punya akun?{" "}
                <Link href="/register" className="text-rose font-bold hover:underline">
                  Daftar Disini
                </Link>
              </div>
            </RevealWrapper>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink flex items-center justify-center font-serif text-paper text-2xl italic">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
