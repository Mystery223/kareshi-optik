import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, customers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { checkRateLimit, logRateLimitBlocked } from "@/lib/cache/redis";

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export async function POST(req: NextRequest) {
    try {
        const forwarded = req.headers.get("x-forwarded-for");
        const realIp = req.headers.get("x-real-ip");
        const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown";

        const ipLimit = await checkRateLimit({
            key: `register:ip:${ip}`,
            limit: 5,
            windowSeconds: 60,
            identifier: ip,
            channel: "register",
        });

        if (!ipLimit.allowed) {
            logRateLimitBlocked({
                channel: "register",
                key: `register:ip:${ip}`,
                identifier: ip,
                limit: 5,
                windowSeconds: 60,
                retryAfter: ipLimit.retryAfter,
                current: ipLimit.current,
            });
            return NextResponse.json(
                { message: `Terlalu banyak percobaan daftar. Coba lagi dalam ${ipLimit.retryAfter} detik.` },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(ipLimit.retryAfter),
                    },
                }
            );
        }

        const body = await req.json();
        const validatedData = registerSchema.parse(body);

        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, validatedData.email))
            .limit(1);

        if (existingUser) {
            return NextResponse.json(
                { message: "Email sudah terdaftar" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        const result = await db.transaction(async (tx) => {
            // 1. Create User
            const [newUser] = await tx
                .insert(users)
                .values({
                    name: validatedData.name,
                    email: validatedData.email,
                    password: hashedPassword,
                    role: "customer",
                })
                .returning();

            // 2. Create Customer Profile
            await tx.insert(customers).values({
                id: newUser.id, // Use same ID or link
                firstName: validatedData.name.split(" ")[0],
                lastName: validatedData.name.split(" ").slice(1).join(" ") || null,
                email: validatedData.email,
                isActive: true,
            });

            return newUser;
        });

        return NextResponse.json({
            message: "Pendaftaran berhasil",
            user: { id: result.id, email: result.email },
        });
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Data tidak valid" }, { status: 400 });
        }
        console.error("[REGISTER_ERROR]", error);
        return NextResponse.json(
            { message: "Terjadi kesalahan internal" },
            { status: 500 }
        );
    }
}
