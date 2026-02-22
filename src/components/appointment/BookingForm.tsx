"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema, type AppointmentFormValues } from "@/lib/validations/appointment";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Assuming sonner is available or can be replaced with alert/nothing
import RevealWrapper from "@/components/ui/RevealWrapper";

interface AvailableSlot {
    id: string;
    startTime: string;
    isFullyBooked: boolean;
}

import { useSession } from "next-auth/react";

export default function BookingForm() {
    const router = useRouter();
    const { data: session } = useSession();
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            serviceType: "Pemeriksaan Mata Rutin",
            date: new Date().toISOString().split("T")[0],
        },
    });

    // Pre-fill user data if logged in
    useEffect(() => {
        if (session?.user) {
            if (session.user.name) setValue("customerName", session.user.name);
            if (session.user.email) setValue("email", session.user.email);
        }
    }, [session, setValue]);

    const selectedDate = watch("date");
    const selectedTime = watch("time");

    // Fetch Available Slots when date changes
    useEffect(() => {
        if (selectedDate) {
            setLoadingSlots(true);
            fetch(`/api/appointments/slots?date=${selectedDate}`)
                .then(async (res) => {
                    if (!res.ok) {
                        const errorText = await res.text();
                        throw new Error(errorText || "Gagal mengambil jadwal");
                    }
                    return res.json();
                })
                .then((data: AvailableSlot[]) => {
                    setAvailableSlots(data);
                    setLoadingSlots(false);
                })
                .catch((error: unknown) => {
                    setLoadingSlots(false);
                    setAvailableSlots([]);
                    const message = error instanceof Error ? error.message : "Gagal mengambil jadwal";
                    toast.error(message);
                });
        }
    }, [selectedDate]);

    const onSubmit = async (data: AppointmentFormValues) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/appointments/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Gagal membuat janji temu");

            const appointment = await response.json() as { bookingCode: string };
            router.push(`/appointment/success?code=${appointment.bookingCode}&name=${data.customerName}&date=${data.date}&time=${data.time}`);
        } catch {
            toast.error("Terjadi kesalahan sistem");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {/* Step 1: Schedule */}
            <RevealWrapper delay={0.2} className="space-y-8 p-10 bg-paper-mid rounded-[40px] border border-border/50">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-ink text-paper flex items-center justify-center font-serif font-bold italic text-xl">1</div>
                    <h3 className="font-serif text-2xl font-bold text-ink">Pilih Jadwal & Layanan</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Service Type */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-ink-light ml-4">Layanan</label>
                        <select
                            {...register("serviceType")}
                            className="w-full bg-paper px-6 py-4 rounded-full border border-border focus:border-rose outline-none font-medium appearance-none"
                        >
                            <option>Pemeriksaan Mata Rutin</option>
                            <option>Konsultasi Lensa Kontak</option>
                            <option>Servis & Perbaikan</option>
                            <option>Pemeriksaan Mata Anak</option>
                        </select>
                    </div>

                    {/* Date Picker */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-ink-light ml-4">Tanggal</label>
                        <input
                            type="date"
                            {...register("date")}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full bg-paper px-6 py-4 rounded-full border border-border focus:border-rose outline-none font-medium"
                        />
                    </div>
                </div>

                {/* Time Slots */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink-light ml-4">Waktu Tersedia</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {loadingSlots ? (
                            [...Array(6)].map((_, i) => (
                                <div key={i} className="h-12 bg-paper animate-pulse rounded-full" />
                            ))
                        ) : availableSlots.length > 0 ? (
                            availableSlots.map((slot) => (
                                <button
                                    type="button"
                                    key={slot.id}
                                    disabled={slot.isFullyBooked}
                                    onClick={() => setValue("time", slot.startTime)}
                                    className={`py-3 rounded-full text-xs font-bold transition-all border ${selectedTime === slot.startTime
                                        ? "bg-rose text-paper border-rose ring-4 ring-rose/20"
                                        : slot.isFullyBooked
                                            ? "bg-paper-mid text-ink-light opacity-30 cursor-not-allowed border-transparent"
                                            : "bg-paper text-ink border-border hover:border-rose"
                                        }`}
                                >
                                    {slot.startTime.substring(0, 5)}
                                </button>
                            ))
                        ) : (
                            <p className="col-span-full text-sm text-ink-light italic py-4">Tidak ada jadwal tersedia hari ini.</p>
                        )}
                    </div>
                    {errors.time && <p className="text-rose text-[10px] font-bold uppercase tracking-widest ml-4">{errors.time.message as string}</p>}
                </div>
            </RevealWrapper>

            {/* Step 2: Information */}
            <RevealWrapper delay={0.4} className="space-y-8 p-10 bg-paper-mid rounded-[40px] border border-border/50">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-ink text-paper flex items-center justify-center font-serif font-bold italic text-xl">2</div>
                    <h3 className="font-serif text-2xl font-bold text-ink">Informasi Customer</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-ink-light ml-4">Nama Lengkap</label>
                        <input
                            type="text"
                            {...register("customerName")}
                            placeholder="Contoh: Sarah Wijaya"
                            className="w-full bg-paper px-6 py-4 rounded-full border border-border focus:border-rose outline-none font-medium"
                        />
                        {errors.customerName && <p className="text-rose text-[10px] font-bold uppercase tracking-widest ml-4">{errors.customerName.message as string}</p>}
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-ink-light ml-4">Nomor WhatsApp</label>
                        <input
                            type="tel"
                            {...register("phone")}
                            placeholder="081234567XXX"
                            className="w-full bg-paper px-6 py-4 rounded-full border border-border focus:border-rose outline-none font-medium"
                        />
                        {errors.phone && <p className="text-rose text-[10px] font-bold uppercase tracking-widest ml-4">{errors.phone.message as string}</p>}
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-ink-light ml-4">Email (Opsional)</label>
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="sarah@example.com"
                            className="w-full bg-paper px-6 py-4 rounded-full border border-border focus:border-rose outline-none font-medium"
                        />
                    </div>

                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink-light ml-4">Catatan Tambahan</label>
                    <textarea
                        {...register("notes")}
                        rows={3}
                        placeholder="Ada pesan khusus untuk kami?"
                        className="w-full bg-paper px-8 py-6 rounded-[32px] border border-border focus:border-rose outline-none font-medium resize-none"
                    />
                </div>

                {session?.user && (
                    <div className="px-6 py-3 bg-rose/5 rounded-2xl border border-rose/10">
                        <p className="text-[10px] font-bold text-rose uppercase tracking-widest">
                            Terautomasi: Data Anda diambil dari profil akun {session.user.email}
                        </p>
                    </div>
                )}
            </RevealWrapper>

            {/* Submit */}
            <RevealWrapper delay={0.6}>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full bg-ink text-paper py-8 rounded-full font-serif text-2xl font-bold italic hover:bg-rose transition-all flex items-center justify-center gap-6 shadow-2xl shadow-ink/10 active:scale-[0.98]"
                >
                    {isSubmitting ? "Satu momen..." : "Konfirmasi Booking"}
                    {!isSubmitting && <span className="text-paper/20 group-hover:text-paper group-hover:translate-x-2 transition-all">→</span>}
                </button>
                <p className="text-center mt-8 text-[10px] text-ink-light font-bold uppercase tracking-[0.2em]">
                    Dengan mengklik konfirmasi, Anda setuju dengan Syarat & Ketentuan Kareshi Optik.
                </p>
            </RevealWrapper>
        </form>
    );
}
