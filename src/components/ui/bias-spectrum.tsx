'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
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
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'relative w-full rounded-full',
          heights[size]
        )}
        style={{
          background:
            'linear-gradient(to right, #4338CA 0%, #2563EB 20%, #64748B 50%, #DC2626 80%, #7F1D1D 100%)',
        }}
      >
        {animated ? (
          <motion.div
            initial={{ left: '50%' }}
            animate={{ left: `${position}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="absolute -top-1 -translate-x-1/2"
          >
            <ChevronDown
              className={cn(
                markerSizes[size],
                'text-zinc-900 dark:text-white drop-shadow-md'
              )}
              strokeWidth={3}
            />
          </motion.div>
        ) : (
          <div
            className="absolute -top-1 -translate-x-1/2"
            style={{ left: `${position}%` }}
          >
            <ChevronDown
              className={cn(
                markerSizes[size],
                'text-zinc-900 dark:text-white drop-shadow-md'
              )}
              strokeWidth={3}
            />
          </div>
        )}
      </div>

      {showLabels && (
        <div className="mt-3 flex justify-between text-xs font-medium">
          <span className="text-indigo-600 dark:text-indigo-400">Left</span>
          <span className="text-slate-500 dark:text-slate-400">Center</span>
          <span className="text-red-600 dark:text-red-400">Right</span>
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
