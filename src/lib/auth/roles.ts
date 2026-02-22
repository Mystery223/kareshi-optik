import { type UserRole } from "@/types";

export function isAdmin(role?: UserRole | null) {
  return role === "admin";
}

export function isAdminOrStaff(role?: UserRole | null) {
  return role === "admin" || role === "staff";
}

export function canDeleteProduct(role?: UserRole | null) {
  return role === "admin";
}
