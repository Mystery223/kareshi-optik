"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { and, count, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth/roles";

function toQuery(path: string, key: "success" | "error", value: string) {
  const params = new URLSearchParams({ [key]: value });
  return `${path}?${params.toString()}`;
}

async function requireAdminSession() {
  const session = await auth();
  const role = session?.user?.role;
  if (!session || !isAdmin(role)) {
    redirect("/admin?error=forbidden");
  }
  return session;
}

async function getActiveAdminCount() {
  const [admins] = await db
    .select({ val: count() })
    .from(users)
    .where(and(eq(users.role, "admin"), eq(users.isActive, true)));
  return Number(admins?.val || 0);
}

export async function createInternalUserAction(formData: FormData) {
  await requireAdminSession();

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "").trim();
  const role = String(formData.get("role") || "staff").trim();

  if (!name || !email || !password) {
    redirect(toQuery("/admin/users", "error", "missing-required-fields"));
  }
  if (password.length < 8) {
    redirect(toQuery("/admin/users", "error", "password-min-8"));
  }
  if (role !== "admin" && role !== "staff") {
    redirect(toQuery("/admin/users", "error", "invalid-role"));
  }

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    redirect(toQuery("/admin/users", "error", "email-already-exists"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
    role,
    isActive: true,
  });

  revalidatePath("/admin/users");
  redirect(toQuery("/admin/users", "success", "user-created"));
}

export async function updateInternalUserRoleAction(formData: FormData) {
  const session = await requireAdminSession();
  const actorId = session.user?.id;

  const targetUserId = String(formData.get("targetUserId") || "").trim();
  const nextRole = String(formData.get("nextRole") || "").trim();

  if (!targetUserId || (nextRole !== "admin" && nextRole !== "staff")) {
    redirect(toQuery("/admin/users", "error", "invalid-request"));
  }

  const [targetUser] = await db
    .select({
      id: users.id,
      role: users.role,
      isActive: users.isActive,
    })
    .from(users)
    .where(eq(users.id, targetUserId))
    .limit(1);

  if (!targetUser) {
    redirect(toQuery("/admin/users", "error", "user-not-found"));
  }
  if (actorId && targetUser.id === actorId) {
    redirect(toQuery("/admin/users", "error", "cannot-change-own-role"));
  }
  if (targetUser.role === nextRole) {
    redirect(toQuery("/admin/users", "success", "role-unchanged"));
  }

  if (targetUser.role === "admin" && nextRole !== "admin" && targetUser.isActive) {
    const activeAdminCount = await getActiveAdminCount();
    if (activeAdminCount <= 1) {
      redirect(toQuery("/admin/users", "error", "cannot-downgrade-last-admin"));
    }
  }

  await db
    .update(users)
    .set({
      role: nextRole,
      updatedAt: new Date(),
    })
    .where(eq(users.id, targetUserId));

  revalidatePath("/admin/users");
  redirect(toQuery("/admin/users", "success", "role-updated"));
}

export async function toggleInternalUserStatusAction(formData: FormData) {
  const session = await requireAdminSession();
  const actorId = session.user?.id;

  const targetUserId = String(formData.get("targetUserId") || "").trim();
  const nextStatus = String(formData.get("nextStatus") || "").trim();

  if (!targetUserId || (nextStatus !== "active" && nextStatus !== "inactive")) {
    redirect(toQuery("/admin/users", "error", "invalid-request"));
  }

  const [targetUser] = await db
    .select({
      id: users.id,
      role: users.role,
      isActive: users.isActive,
    })
    .from(users)
    .where(eq(users.id, targetUserId))
    .limit(1);

  if (!targetUser) {
    redirect(toQuery("/admin/users", "error", "user-not-found"));
  }
  if (actorId && targetUser.id === actorId && nextStatus === "inactive") {
    redirect(toQuery("/admin/users", "error", "cannot-deactivate-own-account"));
  }

  if (targetUser.role === "admin" && targetUser.isActive && nextStatus === "inactive") {
    const activeAdminCount = await getActiveAdminCount();
    if (activeAdminCount <= 1) {
      redirect(toQuery("/admin/users", "error", "cannot-deactivate-last-admin"));
    }
  }

  await db
    .update(users)
    .set({
      isActive: nextStatus === "active",
      updatedAt: new Date(),
    })
    .where(eq(users.id, targetUserId));

  revalidatePath("/admin/users");
  redirect(toQuery("/admin/users", "success", "status-updated"));
}

export async function resetInternalUserPasswordAction(formData: FormData) {
  await requireAdminSession();

  const targetUserId = String(formData.get("targetUserId") || "").trim();
  const newPassword = String(formData.get("newPassword") || "").trim();

  if (!targetUserId || !newPassword) {
    redirect(toQuery("/admin/users", "error", "missing-required-fields"));
  }
  if (newPassword.length < 8) {
    redirect(toQuery("/admin/users", "error", "password-min-8"));
  }

  const [targetUser] = await db.select({ id: users.id }).from(users).where(eq(users.id, targetUserId)).limit(1);
  if (!targetUser) {
    redirect(toQuery("/admin/users", "error", "user-not-found"));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db
    .update(users)
    .set({
      password: hashedPassword,
      updatedAt: new Date(),
    })
    .where(eq(users.id, targetUserId));

  revalidatePath("/admin/users");
  redirect(toQuery("/admin/users", "success", "password-reset"));
}
