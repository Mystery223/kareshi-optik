"use client";

import { useState } from "react";
import { updateProfile, updatePassword } from "@/lib/actions/profile";
import { toast } from "sonner";
import RevealWrapper from "@/components/ui/RevealWrapper";

interface ProfileFormProps {
    initialData: {
        name: string;
        phone: string | null;
        address: string | null;
        city: string | null;
    };
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleProfileUpdate(formData: FormData) {
        setIsLoading(true);
        const result = await updateProfile(formData);
        setIsLoading(false);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(result.success);
        }
    }

    return (
        <div className="space-y-16">
            {/* Profile Section */}
            <RevealWrapper delay={0.1} className="space-y-8">
                <div className="border-b border-border/50 pb-6">
                    <h2 className="font-serif text-3xl font-bold italic text-ink">Informasi Pribadi</h2>
                    <p className="text-xs text-ink-light">Perbarui detail profil Anda untuk pengalaman layanan yang lebih baik.</p>
                </div>

                <form action={handleProfileUpdate} className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Nama Lengkap</label>
                            <input
                                name="name"
                                defaultValue={initialData.name}
                                className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-rose transition-colors text-ink font-medium"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Nomor Telepon</label>
                            <input
                                name="phone"
                                defaultValue={initialData.phone || ""}
                                className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-rose transition-colors text-ink font-medium"
                                placeholder="08123456789"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Kota</label>
                            <input
                                name="city"
                                defaultValue={initialData.city || ""}
                                className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-rose transition-colors text-ink font-medium"
                                placeholder="Jakarta Selatan"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Alamat Lengkap</label>
                            <textarea
                                name="address"
                                defaultValue={initialData.address || ""}
                                rows={1}
                                className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-rose transition-colors text-ink font-medium resize-none"
                                placeholder="Jl. Mawar No. 123..."
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                        <button
                            disabled={isLoading}
                            className="bg-ink text-paper px-12 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-rose active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </RevealWrapper>

            {/* Password Section */}
            <RevealWrapper delay={0.3} className="space-y-8 bg-paper-mid border border-border/50 rounded-[40px] p-10">
                <div className="border-b border-border/50 pb-6">
                    <h2 className="font-serif text-3xl font-bold italic text-ink">Keamanan</h2>
                    <p className="text-xs text-ink-light">Ganti password secara berkala untuk menjaga keamanan akun Anda.</p>
                </div>

                <form action={async (formData) => {
                    setIsLoading(true);
                    const result = await updatePassword(formData);
                    setIsLoading(false);
                    if (result.error) {
                        toast.error(result.error);
                    } else {
                        toast.success(result.success);
                        (document.getElementById("password-form") as HTMLFormElement).reset();
                    }
                }} id="password-form" className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Password Saat Ini</label>
                        <input
                            name="currentPassword"
                            type="password"
                            className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-rose transition-colors text-ink"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Password Baru</label>
                        <input
                            name="newPassword"
                            type="password"
                            className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-rose transition-colors text-ink"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Konfirmasi Password Baru</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-rose transition-colors text-ink"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="md:col-span-3 flex justify-end mt-4">
                        <button
                            disabled={isLoading}
                            className="text-[10px] font-bold uppercase tracking-widest text-rose hover:underline disabled:opacity-50"
                        >
                            Update Password ↗
                        </button>
                    </div>
                </form>
            </RevealWrapper>
        </div>
    );
}
