import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900',
        secondary:
          'border-transparent bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50',
        destructive:
          'border-transparent bg-red-500 text-zinc-50',
        outline: 'text-zinc-950 dark:text-zinc-50',
        socialist: 'border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
        liberal: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
        moderate: 'border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        conservative: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
        libertarian: 'border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
        autocratic: 'border-transparent bg-red-200 text-red-900 dark:bg-red-950/60 dark:text-red-200',
        politician: 'border-transparent bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
        party: 'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        state: 'border-transparent bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        organization: 'border-transparent bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
        verified: 'border-transparent bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
        unverified: 'border-transparent bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
        misleading: 'border-transparent bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
