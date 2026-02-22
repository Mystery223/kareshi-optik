import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function extFromMimeType(mimeType: string) {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "bin";
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "File avatar tidak ditemukan" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ message: "Format file harus JPG, PNG, atau WEBP" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ message: "Ukuran file maksimal 2MB" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    await fs.mkdir(uploadDir, { recursive: true });

    const extension = extFromMimeType(file.type);
    const fileName = `${session.user.id}-${Date.now()}.${extension}`;
    const absolutePath = path.join(uploadDir, fileName);
    const relativePath = `/uploads/avatars/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(absolutePath, buffer);

    const [currentUser] = await db
      .select({ avatarUrl: users.avatarUrl })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    await db
      .update(users)
      .set({
        avatarUrl: relativePath,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    const oldAvatar = currentUser?.avatarUrl || "";
    if (oldAvatar.startsWith("/uploads/avatars/")) {
      const oldName = path.basename(oldAvatar);
      const oldPath = path.join(uploadDir, oldName);
      if (oldPath !== absolutePath) {
        await fs.unlink(oldPath).catch(() => undefined);
      }
    }

    return NextResponse.json({ avatarUrl: relativePath });
  } catch (error) {
    console.error("[PROFILE_AVATAR_UPLOAD_ERROR]", error);
    return NextResponse.json({ message: "Gagal mengupload avatar" }, { status: 500 });
  }
}
