"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users, customers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Password saat ini diperlukan"),
    newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
});

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session) return { error: "Not authenticated" };

    const data = {
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
    };

    const validated = profileSchema.safeParse(data);
    if (!validated.success) {
        return { error: validated.error.issues[0].message };
    }

    try {
        await db.transaction(async (tx) => {
            // Update User table
            await tx.update(users)
                .set({ name: data.name, updatedAt: new Date() })
                .where(eq(users.id, session.user.id));

            // Update Customer table
            const names = data.name.split(" ");
            const firstName = names[0];
            const lastName = names.slice(1).join(" ") || null;

            await tx.update(customers)
                .set({
                    firstName,
                    lastName,
                    phone: data.phone || null,
                    address: data.address || null,
                    city: data.city || null,
                    updatedAt: new Date()
                })
                .where(eq(customers.id, session.user.id));
        });

        revalidatePath("/dashboard/profile");
        return { success: "Profil berhasil diperbarui" };
    } catch (error) {
        console.error(error);
        return { error: "Gagal memperbarui profil" };
    }
}

export async function updatePassword(formData: FormData) {
    const session = await auth();
    if (!session) return { error: "Not authenticated" };

    const data = {
        currentPassword: formData.get("currentPassword") as string,
        newPassword: formData.get("newPassword") as string,
        confirmPassword: formData.get("confirmPassword") as string,
    };

    const validated = passwordSchema.safeParse(data);
    if (!validated.success) {
        return { error: validated.error.issues[0].message };
    }

    try {
        const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);

        const isMatch = await bcrypt.compare(data.currentPassword, user.password);
        if (!isMatch) {
            return { error: "Password saat ini tidak benar" };
        }

        const hashedPassword = await bcrypt.hash(data.newPassword, 10);
        await db.update(users)
            .set({ password: hashedPassword, updatedAt: new Date() })
            .where(eq(users.id, session.user.id));

        return { success: "Password berhasil diperbarui" };
    } catch (error) {
        console.error(error);
        return { error: "Gagal memperbarui password" };
    }
}
