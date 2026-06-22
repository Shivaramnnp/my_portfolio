import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProxiedImageUrl(url: string | null | undefined): string {
  if (!url) return ""
  const match = url.match(/https?:\/\/[^\/]+\/storage\/v1\/object\/public\/portfolio\/(.+)/)
  if (match) {
    return `/supabase-storage/${match[1]}`
  }
  return url
}
