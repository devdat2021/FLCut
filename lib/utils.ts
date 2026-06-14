import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { nanoid } from "nanoid"

const RESERVED = ["api", "admin", "dashboard", "login", "health"]

export function generateSlug(): string {
  return nanoid(6)
}

export function isReserved(slug: string): boolean {
  return RESERVED.includes(slug.toLowerCase())
}

export function getDevice(ua: string): string {
  if (/mobile/i.test(ua)) return "mobile"
  if (/tablet/i.test(ua)) return "tablet"
  return "desktop"
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
