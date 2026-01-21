'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BiasSpectrumProps {
  score: number // -100 to 100
  showLabels?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export function BiasSpectrum({
  score,
  showLabels = true,
  className,
  size = 'md',
  animated = true,
}: BiasSpectrumProps) {
  const position = ((score + 100) / 200) * 100

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  const markerSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'relative w-full rounded-full',
          heights[size],
          'bg-gradient-to-r from-red-500 via-blue-500 via-purple-500 via-red-400 via-amber-500 to-zinc-800'
        )}
        style={{
          background:
            'linear-gradient(to right, #DC2626 0%, #2563EB 20%, #8B5CF6 40%, #EF4444 60%, #F59E0B 80%, #1F2937 100%)',
        }}
      >
        {animated ? (
          <motion.div
            initial={{ left: '50%' }}
            animate={{ left: `${position}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className={cn(
              'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white shadow-lg',
              markerSizes[size]
            )}
          />
        ) : (
          <div
            className={cn(
              'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white shadow-lg',
              markerSizes[size]
            )}
            style={{ left: `${position}%` }}
          />
        )}
      </div>

      {showLabels && (
        <div className="mt-2 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>Left</span>
          <span>Center</span>
          <span>Right</span>
        </div>
      )}
    </div>
  )
}

interface BiasBarProps {
  label: string
  count: number
  total: number
  color: string
  className?: string
}

export function BiasBar({ label, count, total, color, className }: BiasBarProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex justify-between text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
        <span className="text-zinc-500 dark:text-zinc-400">
          {count} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}
