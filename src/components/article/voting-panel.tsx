'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { BiasBar } from '@/components/ui/bias-spectrum'
import { BiasLabel, BIAS_LABELS, BiasVotes } from '@/types'
import { cn } from '@/lib/utils'

interface VotingPanelProps {
  articleId: string
  currentVote?: BiasLabel | null
  votes: BiasVotes
  totalVotes: number
  onVote: (bias: BiasLabel) => void
  isLoading?: boolean
}

export function VotingPanel({
  articleId,
  currentVote,
  votes,
  totalVotes,
  onVote,
  isLoading,
}: VotingPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 overflow-hidden border-t border-zinc-200 pt-4 dark:border-zinc-700"
    >
      <p className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        What political bias do you perceive in this article?
      </p>

      {/* Vote Buttons */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {BIAS_LABELS.map((bias) => {
          const isSelected = currentVote === bias.value
          return (
            <Button
              key={bias.value}
              variant={bias.value.toLowerCase() as any}
              size="sm"
              onClick={() => onVote(bias.value)}
              disabled={isLoading}
              className={cn(
                'relative',
                isSelected && 'ring-2 ring-offset-2',
                !isSelected && 'opacity-80 hover:opacity-100'
              )}
            >
              {bias.label}
              {isSelected && (
                <span className="ml-1 text-xs opacity-80">(Your vote)</span>
              )}
            </Button>
          )
        })}
      </div>

      {/* Vote Distribution */}
      {totalVotes > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Vote Distribution ({totalVotes} total)
          </p>
          {BIAS_LABELS.map((bias) => {
            const count = votes[bias.value.toLowerCase() as keyof BiasVotes]
            return (
              <BiasBar
                key={bias.value}
                label={bias.label}
                count={count}
                total={totalVotes}
                color={bias.color}
              />
            )
          })}
        </div>
      )}

      {totalVotes === 0 && (
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Be the first to vote on this article!
        </p>
      )}
    </motion.div>
  )
}
