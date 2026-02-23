import RevealWrapper from "@/components/ui/RevealWrapper";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import {
  createInternalUserAction,
  resetInternalUserPasswordAction,
  toggleInternalUserStatusAction,
  updateInternalUserRoleAction,
} from "@/lib/actions/admin-users";
import { isAdmin } from "@/lib/auth/roles";

interface AdminUsersPageProps {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
}

function toFeedbackMessage(type: "success" | "error", code?: string) {
  if (!code) return null;

  const successMap: Record<string, string> = {
    "user-created": "Akun internal berhasil dibuat.",
    "role-updated": "Role pengguna berhasil diperbarui.",
    "role-unchanged": "Role tidak berubah karena sama dengan sebelumnya.",
    "status-updated": "Status akun berhasil diperbarui.",
    "password-reset": "Password pengguna berhasil direset.",
  };

  const errorMap: Record<string, string> = {
    "forbidden": "Akses ditolak. Hanya admin yang boleh mengelola user internal.",
    "invalid-request": "Permintaan tidak valid.",
    "missing-required-fields": "Field wajib belum lengkap.",
    "invalid-role": "Role tidak valid.",
    "email-already-exists": "Email sudah digunakan pengguna lain.",
    "user-not-found": "Pengguna tidak ditemukan.",
    "password-min-8": "Password minimal 8 karakter.",
    "cannot-change-own-role": "Anda tidak dapat mengubah role akun sendiri.",
    "cannot-deactivate-own-account": "Anda tidak dapat menonaktifkan akun sendiri.",
    "cannot-downgrade-last-admin": "Admin aktif terakhir tidak boleh diubah menjadi staff.",
    "cannot-deactivate-last-admin": "Admin aktif terakhir tidak boleh dinonaktifkan.",
  };

  return type === "success" ? successMap[code] : errorMap[code];
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session || !isAdmin(role)) {
    redirect("/admin?error=forbidden");
  }

  const query = await searchParams;
  const usersRows = await db.select().from(users).orderBy(desc(users.createdAt));

  const stats = usersRows.reduce(
    (acc, user) => {
      acc.total += 1;
      if (user.role === "admin") acc.admins += 1;
      if (user.role === "staff") acc.staffs += 1;
      if (user.isActive) acc.active += 1;
      return acc;
    },
    { total: 0, admins: 0, staffs: 0, active: 0 }
  );

  const successMessage = toFeedbackMessage("success", query.success);
  const errorMessage = toFeedbackMessage("error", query.error);

  return (
    <div className="p-8 md:p-12 space-y-10">
      <RevealWrapper>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose mb-2">Security</p>
        <h1 className="font-serif text-5xl font-bold text-ink">
          User <span className="italic text-rose/80">Management</span>
        </h1>
      </RevealWrapper>

      {successMessage && (
        <div className="rounded-2xl border border-green-300/50 bg-green-50 px-5 py-4 text-sm text-green-800">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="rounded-2xl border border-rose/30 bg-rose/10 px-5 py-4 text-sm text-rose">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <RevealWrapper delay={0.05} className="rounded-2xl border border-border/50 bg-paper-mid p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Total User</p>
          <p className="mt-2 font-serif text-4xl font-bold text-ink">{stats.total}</p>
        </RevealWrapper>
        <RevealWrapper delay={0.1} className="rounded-2xl border border-border/50 bg-paper-mid p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Admin</p>
          <p className="mt-2 font-serif text-4xl font-bold text-ink">{stats.admins}</p>
        </RevealWrapper>
        <RevealWrapper delay={0.15} className="rounded-2xl border border-border/50 bg-paper-mid p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Staff</p>
          <p className="mt-2 font-serif text-4xl font-bold text-ink">{stats.staffs}</p>
        </RevealWrapper>
        <RevealWrapper delay={0.2} className="rounded-2xl border border-border/50 bg-paper-mid p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Active</p>
          <p className="mt-2 font-serif text-4xl font-bold text-ink">{stats.active}</p>
        </RevealWrapper>
      </div>

      <RevealWrapper delay={0.25} className="rounded-[30px] border border-border/50 bg-paper-mid p-8">
        <h2 className="font-serif text-2xl font-bold text-ink">Tambah User Internal</h2>
        <form action={createInternalUserAction} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <input
            name="name"
            required
            placeholder="Nama lengkap"
            className="rounded-2xl border border-border bg-paper px-4 py-3 text-sm outline-none focus:border-rose"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="email@domain.com"
            className="rounded-2xl border border-border bg-paper px-4 py-3 text-sm outline-none focus:border-rose"
          />
          <input
            name="password"
            type="password"
            minLength={8}
            required
            placeholder="Password minimum 8 karakter"
            className="rounded-2xl border border-border bg-paper px-4 py-3 text-sm outline-none focus:border-rose"
          />
          <div className="flex gap-3">
            <select
              name="role"
              defaultValue="staff"
              className="w-full rounded-2xl border border-border bg-paper px-4 py-3 text-sm outline-none focus:border-rose"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
            <button className="rounded-2xl bg-ink px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-paper transition-colors hover:bg-rose">
              Simpan
            </button>
          </div>
        </form>
      </RevealWrapper>

      <RevealWrapper delay={0.3} className="overflow-hidden rounded-[30px] border border-border/50 bg-paper">
        <div className="grid grid-cols-12 border-b border-border/60 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-ink-light">
          <div className="col-span-3">User</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Last Login</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        <div className="divide-y divide-border/40">
          {usersRows.map((user) => (
            <div key={user.id} className="grid grid-cols-12 items-center gap-3 px-6 py-4 text-sm">
              <div className="col-span-3">
                <p className="font-bold text-ink">{user.name}</p>
                <p className="text-xs text-ink-light">{user.email}</p>
              </div>

              <div className="col-span-2">
                <form action={updateInternalUserRoleAction} className="flex items-center gap-2">
                  <input type="hidden" name="targetUserId" value={user.id} />
                  <select
                    name="nextRole"
                    defaultValue={user.role}
                    className="w-full rounded-xl border border-border bg-paper px-3 py-2 text-xs outline-none focus:border-rose"
                  >
                    <option value="staff">staff</option>
                    <option value="admin">admin</option>
                  </select>
                  <button className="rounded-xl border border-border px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-ink hover:border-rose/50 hover:text-rose">
                    Save
                  </button>
                </form>
              </div>

              <div className="col-span-2">
                <form action={toggleInternalUserStatusAction}>
                  <input type="hidden" name="targetUserId" value={user.id} />
                  <input type="hidden" name="nextStatus" value={user.isActive ? "inactive" : "active"} />
                  <button
                    className={
                      user.isActive
                        ? "rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-green-700 hover:border-green-300"
                        : "rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-amber-700 hover:border-amber-300"
                    }
                  >
                    {user.isActive ? "Active (Disable)" : "Inactive (Enable)"}
                  </button>
                </form>
              </div>

              <div className="col-span-2 text-xs text-ink-mid">
                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("id-ID") : "Never"}
              </div>

              <div className="col-span-3">
                <form action={resetInternalUserPasswordAction} className="flex items-center justify-end gap-2">
                  <input type="hidden" name="targetUserId" value={user.id} />
                  <input
                    name="newPassword"
                    type="password"
                    minLength={8}
                    placeholder="Password baru"
                    className="w-40 rounded-xl border border-border bg-paper px-3 py-2 text-xs outline-none focus:border-rose"
                  />
                  <button className="rounded-xl bg-ink px-3 py-2 text-[10px] font-black uppercase tracking-wider text-paper hover:bg-rose">
                    Reset
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </RevealWrapper>
    </div>
  );
}
