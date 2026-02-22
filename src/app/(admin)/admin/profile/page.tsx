import Link from "next/link";
import RevealWrapper from "@/components/ui/RevealWrapper";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AvatarUploader from "@/components/profile/AvatarUploader";
import { isAdminOrStaff } from "@/lib/auth/roles";

export default async function AdminProfilePage() {
  const session = await auth();

  if (!session || !isAdminOrStaff(session.user.role)) {
    redirect("/login");
  }

  const roleLabel = session.user.role === "admin" ? "Administrator" : "Staff";

  return (
    <div className="p-8 md:p-12 space-y-10">
      <RevealWrapper>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose mb-2">Account</p>
        <h1 className="font-serif text-5xl font-bold text-ink">
          Admin <span className="italic text-rose/80">Profile</span>
        </h1>
      </RevealWrapper>

      <RevealWrapper delay={0.1} className="rounded-[32px] border border-border/50 bg-paper-mid p-8 md:p-10">
        <div className="grid gap-8 md:grid-cols-[180px_1fr]">
          <div className="space-y-3">
            <AvatarUploader role={session.user.role} currentImage={session.user.image} name={session.user.name} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">{roleLabel}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Nama</p>
            <p className="mt-2 text-xl font-bold text-ink">{session.user.name || "-"}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Email</p>
            <p className="mt-2 text-xl font-bold text-ink">{session.user.email || "-"}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Role</p>
            <p className="mt-2 text-xl font-bold text-ink uppercase">{session.user.role}</p>
          </div>
          </div>
        </div>

        <Link
          href="/admin"
          className="mt-8 inline-flex rounded-2xl border border-border px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-ink transition-colors hover:border-rose/50 hover:text-rose"
        >
          Kembali ke Overview
        </Link>
      </RevealWrapper>
    </div>
  );
}
