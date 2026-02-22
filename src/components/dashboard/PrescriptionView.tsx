"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { type ExamHistoryRecord } from "@/types/appointment-detail";

interface PrescriptionViewProps {
    appointment: {
        bookingCode: string;
        guestName: string | null;
        customer: {
            firstName: string;
            lastName: string | null;
        } | null;
        optometrist: {
            name: string;
        } | null;
        examHistory: ExamHistoryRecord | null;
    };
}

export default function PrescriptionView({ appointment }: PrescriptionViewProps) {
    if (!appointment.examHistory) return null;

    const exam = appointment.examHistory;
    const customer = appointment.customer;
    const displayName = customer ? `${customer.firstName} ${customer.lastName}` : appointment.guestName;

    return (
        <div className="bg-white text-ink p-12 max-w-4xl mx-auto shadow-2xl rounded-[40px] border border-border/20 print:shadow-none print:rounded-none print:border-none print:p-0">
            {/* Prescription Header */}
            <div className="flex justify-between items-start border-b-2 border-ink pb-12 mb-12">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-rose mb-2">Kareshi Optik</p>
                    <h2 className="font-serif text-4xl font-bold">Resep <span className="italic text-rose">Digital</span></h2>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-ink-light">Tanggal Periksa</p>
                    <p className="font-bold">{format(new Date(exam.examDate), "dd MMMM yyyy", { locale: id })}</p>
                    <p className="text-[10px] font-bold text-rose uppercase tracking-tighter mt-1">Ref: {appointment.bookingCode}</p>
                </div>
            </div>

            {/* Patient Info */}
            <div className="grid grid-cols-2 gap-12 mb-16 px-4">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-ink-light">Nama Pasien</p>
                    <p className="font-serif text-2xl font-bold italic">{displayName}</p>
                </div>
                <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-ink-light">Optometrist</p>
                    <p className="font-bold text-lg">{appointment.optometrist?.name || "Kareshi Staff"}</p>
                </div>
            </div>

            {/* Prescription Grid */}
            <div className="overflow-hidden border border-ink/10 rounded-[30px] mb-12">
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="bg-paper-mid border-b border-ink/10">
                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest">Mata</th>
                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest">Sphere (SPH)</th>
                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest">Cylinder (CYL)</th>
                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest">Axis</th>
                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-rose">Add</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                        <tr>
                            <td className="py-6 px-4 font-black text-rose bg-rose/5">RE (OD)</td>
                            <td className="py-6 px-4 font-bold text-lg">{exam.reSphere || "-"}</td>
                            <td className="py-6 px-4 font-bold text-lg">{exam.reCylinder || "-"}</td>
                            <td className="py-6 px-4 font-bold text-lg">{exam.reAxis || "-"}</td>
                            <td className="py-6 px-4 font-bold text-lg text-rose">{exam.reAdd || "-"}</td>
                        </tr>
                        <tr>
                            <td className="py-6 px-4 font-black bg-ink/5">LE (OS)</td>
                            <td className="py-6 px-4 font-bold text-lg">{exam.leSphere || "-"}</td>
                            <td className="py-6 px-4 font-bold text-lg">{exam.leCylinder || "-"}</td>
                            <td className="py-6 px-4 font-bold text-lg">{exam.leAxis || "-"}</td>
                            <td className="py-6 px-4 font-bold text-lg text-rose">{exam.leAdd || "-"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* PD & Notes */}
            <div className="grid grid-cols-2 gap-12 mb-16 px-4">
                <div className="bg-paper-mid p-8 rounded-[30px] border border-ink/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-ink-light mb-2">Pupillary Distance (PD)</p>
                    <p className="font-serif text-3xl font-bold italic">{exam.pd || "-"} <span className="text-xs not-italic text-ink-light uppercase tracking-widest ml-2">mm</span></p>
                </div>
                <div className="p-8 border-l-2 border-rose/30">
                    <p className="text-[10px] font-black uppercase tracking-widest text-ink-light mb-4 text-ink-mid">Catatan Tambahan</p>
                    <p className="text-sm font-medium italic leading-relaxed text-ink-mid">
                        {exam.notes || "Gunakan kacamata sesuai saran optometrist untuk kenyamanan penglihatan optimal."}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-8 border-t border-ink/5 opacity-50">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-2">Kareshi Optik Editorial Portfolio</p>
                <p className="text-[8px] uppercase tracking-widest text-ink-light">Jl. Kota Bambu Utara I No.4, RT.6/RW.1, Kota Bambu Utara, Kec. Palmerah, Kota Jakarta Barat, DKI Jakarta 11420 | www.kareshioptik.id</p>
            </div>

            {/* Print Button (Hidden in Print) */}
            <div className="mt-12 flex justify-center print:hidden">
                <button
                    onClick={() => window.print()}
                    className="px-12 py-6 bg-ink text-paper rounded-[30px] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-rose hover:scale-[1.05] transition-all flex items-center gap-4"
                >
                    <span>🖨️ Cetak Resep Digital</span>
                </button>
            </div>
        </div>
    );
}
