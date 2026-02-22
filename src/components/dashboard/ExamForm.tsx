"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type ExamHistoryRecord } from "@/types/appointment-detail";

const examSchema = z.object({
    reSphere: z.string().optional(),
    reCylinder: z.string().optional(),
    reAxis: z.string().optional(),
    reAdd: z.string().optional(),
    leSphere: z.string().optional(),
    leCylinder: z.string().optional(),
    leAxis: z.string().optional(),
    leAdd: z.string().optional(),
    pd: z.string().optional(),
    notes: z.string().optional(),
});

type ExamFormValues = z.infer<typeof examSchema>;

interface ExamFormProps {
    appointmentId: string;
    customerId?: string;
    initialData?: ExamHistoryRecord | null;
}

export default function ExamForm({ appointmentId, customerId, initialData }: ExamFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit } = useForm<ExamFormValues>({
        resolver: zodResolver(examSchema),
        defaultValues: initialData ? {
            reSphere: initialData.reSphere?.toString(),
            reCylinder: initialData.reCylinder?.toString(),
            reAxis: initialData.reAxis?.toString(),
            reAdd: initialData.reAdd?.toString(),
            leSphere: initialData.leSphere?.toString(),
            leCylinder: initialData.leCylinder?.toString(),
            leAxis: initialData.leAxis?.toString(),
            leAdd: initialData.leAdd?.toString(),
            pd: initialData.pd?.toString(),
            notes: initialData.notes || "",
        } : {}
    });

    const onSubmit = async (data: ExamFormValues) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/admin/exams", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, appointmentId, customerId }),
            });

            if (!response.ok) throw new Error("Gagal menyimpan data pemeriksaan");

            toast.success("Rekam medis berhasil disimpan");
            router.refresh();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 pb-12">
            <div className="grid md:grid-cols-2 gap-12">
                {/* Right Eye (OD) */}
                <div className="space-y-8 bg-paper-mid p-10 rounded-[40px] border border-border/30">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose text-paper flex items-center justify-center text-[10px] font-black">RE</div>
                        <h3 className="font-serif text-xl font-bold italic">Right Eye (Oculus Dexter)</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-ink-light ml-2">Sphere (SPH)</label>
                            <input {...register("reSphere")} className="w-full h-14 bg-paper rounded-2xl px-6 font-bold text-ink border border-transparent focus:border-rose/30 outline-none transition-all" placeholder="-1.25" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-ink-light ml-2">Cylinder (CYL)</label>
                            <input {...register("reCylinder")} className="w-full h-14 bg-paper rounded-2xl px-6 font-bold text-ink border border-transparent focus:border-rose/30 outline-none transition-all" placeholder="-0.50" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-ink-light ml-2">Axis</label>
                            <input {...register("reAxis")} className="w-full h-14 bg-paper rounded-2xl px-6 font-bold text-ink border border-transparent focus:border-rose/30 outline-none transition-all" placeholder="180" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-ink-light ml-2">Add</label>
                            <input {...register("reAdd")} className="w-full h-14 bg-paper rounded-2xl px-6 font-bold text-ink border border-transparent focus:border-rose/30 outline-none transition-all" placeholder="+2.00" />
                        </div>
                    </div>
                </div>

                {/* Left Eye (OS) */}
                <div className="space-y-8 bg-paper-mid p-10 rounded-[40px] border border-border/30">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-ink text-paper flex items-center justify-center text-[10px] font-black">LE</div>
                        <h3 className="font-serif text-xl font-bold italic">Left Eye (Oculus Sinister)</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-ink-light ml-2">Sphere (SPH)</label>
                            <input {...register("leSphere")} className="w-full h-14 bg-paper rounded-2xl px-6 font-bold text-ink border border-transparent focus:border-rose/30 outline-none transition-all" placeholder="-1.00" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-ink-light ml-2">Cylinder (CYL)</label>
                            <input {...register("leCylinder")} className="w-full h-14 bg-paper rounded-2xl px-6 font-bold text-ink border border-transparent focus:border-rose/30 outline-none transition-all" placeholder="-0.75" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-ink-light ml-2">Axis</label>
                            <input {...register("leAxis")} className="w-full h-14 bg-paper rounded-2xl px-6 font-bold text-ink border border-transparent focus:border-rose/30 outline-none transition-all" placeholder="175" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-ink-light ml-2">Add</label>
                            <input {...register("leAdd")} className="w-full h-14 bg-paper rounded-2xl px-6 font-bold text-ink border border-transparent focus:border-rose/30 outline-none transition-all" placeholder="+2.00" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-paper-mid p-10 rounded-[40px] border border-border/30 space-y-8">
                <div className="grid md:grid-cols-3 gap-12">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-ink-light ml-2">Pupillary Distance (PD)</label>
                        <input {...register("pd")} className="w-full h-14 bg-paper rounded-2xl px-6 font-bold text-ink border border-transparent focus:border-rose/30 outline-none transition-all" placeholder="64" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-ink-light ml-2">Catatan Tambahan</label>
                        <input {...register("notes")} className="w-full h-14 bg-paper rounded-2xl px-6 font-bold text-ink border border-transparent focus:border-rose/30 outline-none transition-all" placeholder="Misal: Progresif, Anti-Radiasi..." />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-ink text-paper rounded-[30px] font-black uppercase tracking-[0.3em] text-xs hover:bg-rose hover:scale-[1.01] transition-all disabled:opacity-50"
            >
                {isSubmitting ? "Menyimpan..." : "Simpan Rekam Medis"}
            </button>
        </form>
    );
}
