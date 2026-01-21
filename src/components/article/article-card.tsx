'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ExternalLink,
  Clock,
  User,
  MessageSquare,
  ChevronRight,
  Sparkles,
  Vote,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BiasSpectrum } from '@/components/ui/bias-spectrum'
import { Tooltip } from '@/components/ui/tooltip'
import { cn, formatRelativeTime } from '@/lib/utils'
import { ArticleWithDetails, BIAS_LABELS, BiasLabel } from '@/types'
import { VotingPanel } from './voting-panel'

interface ArticleCardProps {
  article: ArticleWithDetails
  onVote?: (articleId: string, bias: BiasLabel) => Promise<void>
}

export function ArticleCard({ article, onVote }: ArticleCardProps) {
  const [showVoting, setShowVoting] = useState(false)
  const [isVoting, setIsVoting] = useState(false)

  const biasScore = article.communityBiasScore ?? article.aiBiasScore ?? 0
  const biasLabel = article.aiPredictedBias as BiasLabel | undefined

  const handleVote = async (bias: BiasLabel) => {
    if (!onVote) return
    setIsVoting(true)
    try {
      await onVote(article.id, bias)
    } finally {
      setIsVoting(false)
      setShowVoting(false)
    }
  }

  const approvedNotes = article.communityNotes?.filter(
    (n) => n.status === 'APPROVED'
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden transition-all hover:shadow-lg dark:hover:shadow-zinc-800/50">
        <CardContent className="p-0">
          {/* Image */}
          {article.imageUrl && (
            <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <img
                src={article.imageUrl}
                alt={article.headline}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* AI Bias Badge */}
              {biasLabel && (
                <div className="absolute right-3 top-3">
                  <Tooltip
                    content={
                      <div className="max-w-xs">
                        <p className="font-medium">AI Prediction</p>
                        <p className="text-xs opacity-80">
                          {article.aiConfidence
                            ? `${article.aiConfidence.toFixed(0)}% confidence`
                            : 'Based on content analysis'}
                        </p>
                      </div>
                    }
                  >
                    <Badge
                      variant={biasLabel.toLowerCase() as any}
                      className="flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      {biasLabel}
                    </Badge>
                  </Tooltip>
                </div>
              )}
            </div>
          )}

          <div className="p-5">
            {/* Source & Category */}
            <div className="mb-2 flex items-center gap-2">
              {article.source && (
                <Badge variant="secondary" className="text-xs">
                  {article.source.name}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {article.category}
              </Badge>
              <span className="ml-auto flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                <Clock className="h-3 w-3" />
                {formatRelativeTime(article.publishedAt)}
              </span>
            </div>

            {/* Headline */}
            <Link href={`/article/${article.id}`}>
              <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-zinc-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                {article.headline}
              </h3>
            </Link>

            {/* Description */}
            <p className="mb-4 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {article.shortDescription}
            </p>

            {/* Entity Tags */}
            {article.entities && article.entities.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {article.entities.slice(0, 4).map((ae) => (
                  <Badge
                    key={ae.entity.id}
                    variant={ae.entity.type.toLowerCase() as any}
                    className="text-xs"
                  >
                    {ae.entity.name}
                  </Badge>
                ))}
                {article.entities.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{article.entities.length - 4} more
                  </Badge>
                )}
              </div>
            )}

            {/* Bias Spectrum */}
            <div className="mb-4">
              <BiasSpectrum score={biasScore} size="sm" showLabels={false} />
            </div>

            {/* Community Note Preview */}
            {approvedNotes && approvedNotes.length > 0 && (
              <div className="mb-4 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                <div className="mb-1 flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                  <MessageSquare className="h-3 w-3" />
                  Community Note
                </div>
                <p className="line-clamp-2 text-xs text-amber-800 dark:text-amber-300">
                  {approvedNotes[0].content}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <Vote className="h-4 w-4" />
                  {article.totalVotes} votes
                </span>
                {article.authors && (
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {article.authors.split(',')[0]}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVoting(!showVoting)}
                  className={cn(
                    article.userVote && 'border-green-500 text-green-600'
                  )}
                >
                  {article.userVote ? `Voted: ${article.userVote}` : 'Vote'}
                </Button>
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Voting Panel */}
            {showVoting && (
              <VotingPanel
                articleId={article.id}
                currentVote={article.userVote}
                votes={{
                  socialist: article.votesSocialist,
                  liberal: article.votesLiberal,
                  moderate: article.votesModerate,
                  conservative: article.votesConservative,
                  libertarian: article.votesLibertarian,
                  autocratic: article.votesAutocratic,
                }}
                totalVotes={article.totalVotes}
                onVote={handleVote}
                isLoading={isVoting}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
