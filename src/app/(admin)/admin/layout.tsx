import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { isAdminOrStaff } from "@/lib/auth/roles";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session || !isAdminOrStaff(session.user.role)) {
        redirect("/login");
    }

    return (
        <div className="flex bg-paper min-h-screen">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
