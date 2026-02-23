"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { invalidateProductCaches } from "@/lib/cache/redis";
import { canDeleteProduct } from "@/lib/auth/roles";

export async function deleteProductAction(id: string) {
    const session = await auth();
    const role = session?.user?.role;
    if (!session || !canDeleteProduct(role)) {
        return { success: false, error: "Akses ditolak. Hanya admin yang dapat menghapus produk." };
    }

    try {
        await db.transaction(async (tx) => {
            // 1. Delete associated variants first (due to foreign key constraints if not cascaded)
            await tx.delete(productVariants).where(eq(productVariants.productId, id));

            // 2. Delete the product
            await tx.delete(products).where(eq(products.id, id));
        });

        // 3. Revalidate and clean cache
        revalidatePath("/admin/produk");
        await invalidateProductCaches();

        return { success: true };
    } catch (error) {
        console.error("[DELETE_PRODUCT_ERROR]", error);
        return { success: false, error: "Gagal menghapus produk" };
    }
}
