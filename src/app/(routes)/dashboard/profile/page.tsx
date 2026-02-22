import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RevealWrapper from "@/components/ui/RevealWrapper";
import Link from "next/link";
import { db } from "@/lib/db";
import { customers, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ProfileForm from "@/components/dashboard/ProfileForm";
import AvatarUploader from "@/components/profile/AvatarUploader";

export default async function ProfilePage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const [customerData] = await db
        .select({
            phone: customers.phone,
            address: customers.address,
            city: customers.city,
            avatarUrl: users.avatarUrl,
        })
        .from(customers)
        .leftJoin(users, eq(users.id, customers.id))
        .where(eq(customers.id, session.user.id))
        .limit(1);

    if (!customerData) {
        return (
            <div className="pt-32 text-center">
                <p>Data profil tidak ditemukan.</p>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-4xl mx-auto space-y-16">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/50 pb-12">
                    <RevealWrapper className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose">Settings</p>
                        <h1 className="font-serif text-5xl md:text-7xl font-bold text-ink">
                            Profil <span className="italic">Saya</span>
                        </h1>
                        <p className="text-ink-mid max-w-lg">Kelola informasi akun dan pengaturan keamanan Anda.</p>
                    </RevealWrapper>

                    <RevealWrapper delay={0.2}>
                        <Link
                            href="/dashboard"
                            className="text-[10px] font-bold uppercase tracking-widest text-ink-light hover:text-rose transition-colors"
                        >
                            ← Dashboard
                        </Link>
                    </RevealWrapper>
                </div>

                <div className="grid gap-10 md:grid-cols-[180px_1fr]">
                    <AvatarUploader role="customer" currentImage={customerData.avatarUrl} name={session.user.name} />
                    <ProfileForm
                        initialData={{
                            name: session.user.name || "",
                            phone: customerData.phone,
                            address: customerData.address,
                            city: customerData.city,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
