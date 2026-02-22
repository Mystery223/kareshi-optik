import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RevealWrapper from "@/components/ui/RevealWrapper";
import Link from "next/link";
import { db } from "@/lib/db";
import { eyeExamHistory, optometrists } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function MedicalRecordsPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const medicalRecords = await db
        .select({
            id: eyeExamHistory.id,
            examDate: eyeExamHistory.examDate,
            reSphere: eyeExamHistory.reSphere,
            reCylinder: eyeExamHistory.reCylinder,
            reAxis: eyeExamHistory.reAxis,
            reAdd: eyeExamHistory.reAdd,
            leSphere: eyeExamHistory.leSphere,
            leCylinder: eyeExamHistory.leCylinder,
            leAxis: eyeExamHistory.leAxis,
            leAdd: eyeExamHistory.leAdd,
            pd: eyeExamHistory.pd,
            notes: eyeExamHistory.notes,
            nextExamDate: eyeExamHistory.nextExamDate,
            optometristName: optometrists.name,
            optometristTitle: optometrists.title,
        })
        .from(eyeExamHistory)
        .leftJoin(optometrists, eq(eyeExamHistory.optometristId, optometrists.id))
        .where(eq(eyeExamHistory.customerId, session.user.id))
        .orderBy(desc(eyeExamHistory.examDate));

    return (
        <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/50 pb-12">
                    <RevealWrapper className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose">Medical Records</p>
                        <h1 className="font-serif text-5xl md:text-7xl font-bold text-ink">
                            Rekam <span className="italic">Medis Mata</span>
                        </h1>
                        <p className="text-ink-mid max-w-lg">Akses data hasil pemeriksaan mata Anda. Data ini bersifat pribadi dan aman.</p>
                    </RevealWrapper>

                    <RevealWrapper delay={0.2}>
                        <Link
                            href="/dashboard"
                            className="text-[10px] font-bold uppercase tracking-widest text-ink-light hover:text-rose transition-colors"
                        >
                            ← Kembali ke Dashboard
                        </Link>
                    </RevealWrapper>
                </div>

                {/* Medical Records Grid */}
                <div className="grid gap-8 lg:grid-cols-1">
                    {medicalRecords.length > 0 ? (
                        medicalRecords.map((record, index) => (
                            <RevealWrapper key={record.id} delay={0.1 * index} className="bg-paper-mid/30 border border-border/50 rounded-[40px] p-10 space-y-10 group hover:border-rose/30 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose">Pemeriksaan Tanggal</p>
                                        <h3 className="font-serif text-3xl font-bold text-ink">
                                            {format(new Date(record.examDate), "dd MMMM yyyy", { locale: id })}
                                        </h3>
                                    </div>
                                    <div className="bg-paper rounded-2xl p-4 border border-border/30">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Dokter Pemeriksa</p>
                                        <p className="font-bold text-ink">{record.optometristName || "N/A"}</p>
                                        <p className="text-[10px] text-ink-mid">{record.optometristTitle}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 border-t border-border/30 pt-10">
                                    {/* Right Eye (RE/OD) */}
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light border-b border-border/30 pb-2">Right Eye (RE/OD)</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] text-ink-mid uppercase tracking-widest">Sphere</p>
                                                <p className="font-serif text-xl font-bold text-ink">{record.reSphere || "0.00"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-ink-mid uppercase tracking-widest">Cylinder</p>
                                                <p className="font-serif text-xl font-bold text-ink">{record.reCylinder || "0.00"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-ink-mid uppercase tracking-widest">Axis</p>
                                                <p className="font-serif text-xl font-bold text-ink">{record.reAxis || "0"}°</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-ink-mid uppercase tracking-widest">Addition</p>
                                                <p className="font-serif text-xl font-bold text-ink">{record.reAdd || "0.00"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Left Eye (LE/OS) */}
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light border-b border-border/30 pb-2">Left Eye (LE/OS)</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] text-ink-mid uppercase tracking-widest">Sphere</p>
                                                <p className="font-serif text-xl font-bold text-ink">{record.leSphere || "0.00"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-ink-mid uppercase tracking-widest">Cylinder</p>
                                                <p className="font-serif text-xl font-bold text-ink">{record.leCylinder || "0.00"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-ink-mid uppercase tracking-widest">Axis</p>
                                                <p className="font-serif text-xl font-bold text-ink">{record.leAxis || "0"}°</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-ink-mid uppercase tracking-widest">Addition</p>
                                                <p className="font-serif text-xl font-bold text-ink">{record.leAdd || "0.00"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Other Info */}
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light border-b border-border/30 pb-2">Additional Info</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] text-ink-mid uppercase tracking-widest">Pupillary Distance (PD)</p>
                                                <p className="font-serif text-xl font-bold text-ink">{record.pd || "N/A"} mm</p>
                                            </div>
                                            {record.nextExamDate && (
                                                <div>
                                                    <p className="text-[10px] text-ink-mid uppercase tracking-widest">Jadwal Periksa Berikutnya</p>
                                                    <p className="text-sm font-bold text-rose">
                                                        {format(new Date(record.nextExamDate), "MMMM yyyy", { locale: id })}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {record.notes && (
                                    <div className="bg-ink/5 rounded-3xl p-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light mb-2">Catatan Dokter</p>
                                        <p className="text-sm text-ink-mid leading-relaxed italic">&ldquo;{record.notes}&rdquo;</p>
                                    </div>
                                )}
                            </RevealWrapper>
                        ))
                    ) : (
                        <div className="text-center py-32 bg-paper-mid rounded-[60px] border border-dashed border-border/50">
                            <div className="max-w-xs mx-auto space-y-6">
                                <RevealWrapper>
                                    <p className="text-ink-mid font-medium">Belum ada rekam medis yang tercatat.</p>
                                    <p className="text-xs text-ink-light mt-2">Lakukan pemeriksaan mata rutin pertama Anda untuk mulai memantau kesehatan mata.</p>
                                    <Link href="/appointment" className="mt-8 inline-block bg-ink text-paper px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-rose transition-colors">Buat Janji Temu</Link>
                                </RevealWrapper>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
