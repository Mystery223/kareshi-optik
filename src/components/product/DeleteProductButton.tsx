"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { deleteProductAction } from "@/lib/actions/product";

interface DeleteProductButtonProps {
    productId: string;
    productName: string;
}

export default function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        const confirmResult = await Swal.fire({
            title: "Hapus produk ini?",
            text: `Produk "${productName}" akan dihapus permanen.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
            reverseButtons: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#374151",
        });

        if (!confirmResult.isConfirmed) return;

        setIsDeleting(true);
        try {
            const result = await deleteProductAction(productId);
            if (result.success) {
                await Swal.fire({
                    title: "Berhasil",
                    text: `Produk "${productName}" berhasil dihapus.`,
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#111827",
                });
            } else {
                await Swal.fire({
                    title: "Gagal menghapus",
                    text: result.error || "Terjadi kesalahan saat menghapus produk.",
                    icon: "error",
                    confirmButtonText: "Tutup",
                    confirmButtonColor: "#111827",
                });
            }
        } catch {
            await Swal.fire({
                title: "Error sistem",
                text: "Terjadi kesalahan sistem.",
                icon: "error",
                confirmButtonText: "Tutup",
                confirmButtonColor: "#111827",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            disabled={isDeleting}
            onClick={handleDelete}
            className="text-[10px] font-black uppercase tracking-widest text-ink-light hover:text-rose transition-colors ml-4 disabled:opacity-50"
            title="Hapus Produk"
        >
            {isDeleting ? "Menghapus..." : "Hapus ✕"}
        </button>
    );
}
