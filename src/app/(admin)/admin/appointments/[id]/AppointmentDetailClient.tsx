"use client";

import { useState } from "react";
import RevealWrapper from "@/components/ui/RevealWrapper";
import ExamForm from "@/components/dashboard/ExamForm";
import PrescriptionView from "@/components/dashboard/PrescriptionView";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import { type ExamHistoryRecord } from "@/types/appointment-detail";

type AppointmentDetail = {
    id: string;
    bookingCode: string;
    guestName: string | null;
    guestPhone: string | null;
    guestEmail: string | null;
    appointmentDate: string;
    appointmentTime: string;
    serviceType: string;
    status: string;
    notes: string | null;
    customer: {
        id: string;
        firstName: string;
        lastName: string | null;
        email: string | null;
        phone: string | null;
        birthDate: string | null;
    } | null;
    optometrist: {
        id: string;
        name: string;
    } | null;
    examHistory: ExamHistoryRecord | null;
};

interface AppointmentDetailClientProps {
    appointment: AppointmentDetail;
}

export default function AppointmentDetailClient({ appointment }: AppointmentDetailClientProps) {
    const [activeTab, setActiveTab] = useState<"details" | "exam" | "resep">("details");

    const customer = appointment.customer;
    const displayName = customer
        ? `${customer.firstName} ${customer.lastName ?? ""}`.trim()
        : (appointment.guestName || "Guest");

    return (
        <div className="p-8 md:p-12 space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <RevealWrapper>
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/admin/appointments" className="text-[10px] font-black uppercase tracking-widest text-rose hover:text-ink transition-colors">
                            ← Kembali
                        </Link>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-ink-light">Appointment Detail</p>
                    </div>
                    <h1 className="font-serif text-5xl font-bold text-ink">
                        {displayName} <span className="italic text-rose/80">#{appointment.bookingCode}</span>
                    </h1>
                </RevealWrapper>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-border/30">
                {[
                    { id: "details", label: "Detail Janji Temu" },
                    { id: "exam", label: "Rekam Medis / Pemeriksaan" },
                    { id: "resep", label: "Resep Digital", disabled: !appointment.examHistory },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        disabled={tab.disabled}
                        onClick={() => setActiveTab(tab.id as "details" | "exam" | "resep")}
                        className={cn(
                            "pb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                            activeTab === tab.id ? "text-rose" : "text-ink-light hover:text-ink",
                            tab.disabled && "opacity-30 cursor-not-allowed grayscale"
                        )}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeAttr"
                                className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-rose transition-all"
                            />
                        )}
                    </button>
                ))}
            </div>

            <RevealWrapper delay={0.1}>
                {activeTab === "details" ? (
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Appointment Info */}
                        <div className="space-y-8 bg-paper-mid p-10 rounded-[40px] border border-border/30">
                            <h3 className="font-serif text-2xl font-bold italic">Informasi Janji Temu</h3>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-ink-light">Tanggal & Waktu</p>
                                    <p className="font-bold text-ink">{format(new Date(appointment.appointmentDate), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                                    <p className="text-sm font-medium text-ink-mid">{appointment.appointmentTime}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-ink-light">Jenis Layanan</p>
                                    <p className="font-bold text-ink">{appointment.serviceType}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-ink-light">Status</p>
                                    <div className={`inline-block px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${appointment.status === 'confirmed' ? 'border-green-200 text-green-700 bg-green-50' :
                                            appointment.status === 'pending' ? 'border-amber-200 text-amber-700 bg-amber-50' :
                                                appointment.status === 'completed' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                                                    'border-ink/10 text-ink-mid bg-ink/5'
                                        }`}>
                                        {appointment.status}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-ink-light">Optometrist</p>
                                    <p className="font-bold text-ink">{appointment.optometrist?.name || "Belum ditentukan"}</p>
                                </div>
                            </div>
                            <div className="space-y-1 pt-4 border-t border-border/20">
                                <p className="text-[10px] font-black uppercase tracking-widest text-ink-light">Catatan Booking</p>
                                <p className="text-sm text-ink-mid italic">{appointment.notes || "Tidak ada catatan."}</p>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="space-y-8 bg-paper-mid p-10 rounded-[40px] border border-border/30">
                            <h3 className="font-serif text-2xl font-bold italic">Informasi Pelanggan</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-3xl bg-ink text-paper flex items-center justify-center text-xl font-serif">
                                        {displayName.charAt(0)}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-ink text-xl">{displayName}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-rose">{customer ? 'Registered Customer' : 'Guest'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 pt-4 border-t border-border/20">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-ink-light">Nomor Telepon</p>
                                        <p className="font-bold text-ink">{customer?.phone || appointment.guestPhone}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-ink-light">Alamat Email</p>
                                        <p className="font-bold text-ink truncate max-w-full">{customer?.email || appointment.guestEmail || "-"}</p>
                                    </div>
                                </div>

                                {customer?.birthDate && (
                                    <div className="space-y-1 pt-4 border-t border-border/20">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-ink-light">Tanggal Lahir</p>
                                        <p className="font-bold text-ink">{format(new Date(customer.birthDate), "dd MMMM yyyy", { locale: id })}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : activeTab === "exam" ? (
                    <div className="space-y-8">
                        <div className="bg-ink text-paper p-10 rounded-[40px] border border-border/30 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-serif text-3xl font-bold italic">Input Hasil Pemeriksaan</h3>
                                {appointment.examHistory && (
                                    <span className="px-4 py-2 bg-rose/20 text-rose border border-rose/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        Selesai Diperiksa
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-paper-mid max-w-2xl">Masukkan data rekam medis untuk mata kanan (RE) dan mata kiri (LE). Data ini akan tersinkronisasi langsung ke portal pelanggan.</p>
                        </div>

                        <ExamForm
                            appointmentId={appointment.id}
                            customerId={customer?.id}
                            initialData={appointment.examHistory}
                        />
                    </div>
                ) : (
                    <PrescriptionView appointment={appointment} />
                )}
            </RevealWrapper>
        </div>
    );
}
