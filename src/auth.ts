import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { UserRole } from "./types";
import { checkRateLimit, logRateLimitBlocked } from "@/lib/cache/redis";

declare module "next-auth" {
    interface User {
        role?: UserRole;
    }
    interface Session {
        user: {
            id: string;
            role: UserRole;
        } & import("next-auth").DefaultSession["user"];
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            async authorize(credentials, request) {
                const forwarded = request?.headers?.get("x-forwarded-for");
                const realIp = request?.headers?.get("x-real-ip");
                const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown";

                const ipLimit = await checkRateLimit({
                    key: `login:ip:${ip}`,
                    limit: 10,
                    windowSeconds: 60,
                    identifier: ip,
                    channel: "login-ip",
                });

                if (!ipLimit.allowed) {
                    logRateLimitBlocked({
                        channel: "login-ip",
                        key: `login:ip:${ip}`,
                        identifier: ip,
                        limit: 10,
                        windowSeconds: 60,
                        retryAfter: ipLimit.retryAfter,
                        current: ipLimit.current,
                    });
                    return null;
                }

                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const emailLimit = await checkRateLimit({
                        key: `login:email:${email.toLowerCase()}`,
                        limit: 8,
                        windowSeconds: 60,
                        identifier: email.toLowerCase(),
                        channel: "login-email",
                    });

                    if (!emailLimit.allowed) {
                        logRateLimitBlocked({
                            channel: "login-email",
                            key: `login:email:${email.toLowerCase()}`,
                            identifier: email.toLowerCase(),
                            limit: 8,
                            windowSeconds: 60,
                            retryAfter: emailLimit.retryAfter,
                            current: emailLimit.current,
                        });
                        return null;
                    }

                    const [user] = await db
                        .select()
                        .from(users)
                        .where(eq(users.email, email))
                        .limit(1);

                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            image: user.avatarUrl,
                        };
                    }
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.image = user.image;
            }
            if (trigger === "update" && session && typeof session === "object" && "image" in session) {
                token.image = session.image as string | null | undefined;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = (token.role as UserRole | undefined) ?? "customer";
                session.user.image = (token.image as string | null | undefined) ?? null;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: { strategy: "jwt" },
});
