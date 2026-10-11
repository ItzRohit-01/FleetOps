import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
  return `₹${amount.toFixed(0)}`
}

export function formatDistance(km: number): string {
  return `${km.toFixed(0)} km`
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function relativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true
  })
}

export function formatDateTime(isoString: string): string {
  return `${formatDate(isoString)}, ${formatTime(isoString)}`
}

export function daysUntil(isoString: string): number {
  const diff = new Date(isoString).getTime() - Date.now()
  return Math.ceil(diff / 86400000)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
