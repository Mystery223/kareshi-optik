import { type UserRole } from "@/types";

export function getRoleAvatar(role?: UserRole | null, customImage?: string | null) {
  if (customImage && customImage.trim().length > 0) return customImage;

  if (role === "admin") return "/images/avatars/admin.svg";
  if (role === "staff") return "/images/avatars/staff.svg";
  return "/images/avatars/customer.svg";
}
