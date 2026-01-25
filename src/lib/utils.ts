import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

export function calculateBiasScore(votes: {
  socialist: number
  liberal: number
  moderate: number
  conservative: number
  libertarian: number
  autocratic: number
}): number {
  const weights = {
    socialist: -100,
    liberal: -50,
    moderate: 0,
    conservative: 50,
    libertarian: 75,
    autocratic: 100,
  }

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0)
  if (totalVotes === 0) return 0

  let weightedSum = 0
  for (const [key, count] of Object.entries(votes)) {
    weightedSum += weights[key as keyof typeof weights] * count
  }

  return weightedSum / totalVotes
}

export function getBiasLabel(score: number): string {
  if (score <= -75) return 'SOCIALIST'
  if (score <= -25) return 'LIBERAL'
  if (score <= 25) return 'MODERATE'
  if (score <= 60) return 'CONSERVATIVE'
  if (score <= 85) return 'LIBERTARIAN'
  return 'AUTOCRATIC'
}

export function getBiasColor(bias: string): string {
  const colors: Record<string, string> = {
    SOCIALIST: '#4338CA',
    LIBERAL: '#2563EB',
    MODERATE: '#64748B',
    CONSERVATIVE: '#DC2626',
    LIBERTARIAN: '#EA580C',
    AUTOCRATIC: '#7F1D1D',
  }
  return colors[bias] || '#6B7280'
}

export function getBiasGradient(score: number): string {
  // Returns a gradient position from 0-100 based on bias score (-100 to 100)
  return `${((score + 100) / 200) * 100}%`
}
