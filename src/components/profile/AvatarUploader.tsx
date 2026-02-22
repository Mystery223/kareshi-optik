"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getRoleAvatar } from "@/lib/utils/role-avatar";
import { type UserRole } from "@/types";

interface AvatarUploaderProps {
  role: UserRole;
  currentImage?: string | null;
  name?: string | null;
}

export default function AvatarUploader({ role, currentImage, name }: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { update } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(getRoleAvatar(role, currentImage));

  async function onFileChange(file: File | null) {
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setIsUploading(true);
    try {
      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { avatarUrl?: string; message?: string };
      if (!response.ok || !data.avatarUrl) {
        throw new Error(data.message || "Gagal upload avatar");
      }

      setPreview(data.avatarUrl);
      await update({ image: data.avatarUrl });
      toast.success("Foto profil berhasil diperbarui");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan saat upload";
      toast.error(message);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative h-40 w-40 overflow-hidden rounded-[28px] border border-border/40 bg-paper">
        <Image
          src={preview}
          alt={`Avatar ${name || role}`}
          fill
          sizes="160px"
          className="object-cover"
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) => onFileChange(event.target.files?.[0] || null)}
      />

      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className="rounded-2xl border border-border px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-ink transition-colors hover:border-rose/50 hover:text-rose disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Upload Foto"}
      </button>
      <p className="text-[10px] text-ink-light uppercase tracking-[0.12em]">Format: JPG, PNG, WEBP (maks 2MB)</p>
    </div>
  );
}
