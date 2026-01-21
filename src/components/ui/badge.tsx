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
        socialist: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        liberal: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        moderate: 'border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        conservative: 'border-transparent bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        libertarian: 'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        autocratic: 'border-transparent bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300',
        politician: 'border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        party: 'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        state: 'border-transparent bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        organization: 'border-transparent bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        verified: 'border-transparent bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        false: 'border-transparent bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        misleading: 'border-transparent bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
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
