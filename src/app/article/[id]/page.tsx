'use client'

import { use, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  User,
  Calendar,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BiasSpectrum, BiasBar } from '@/components/ui/bias-spectrum'
import { VotingPanel } from '@/components/article/voting-panel'
import {
  CommunityNote,
  AddCommunityNote,
} from '@/components/article/community-note'
import { formatDate, formatRelativeTime, cn } from '@/lib/utils'
import { ArticleWithDetails, BiasLabel, BIAS_LABELS } from '@/types'
import { useStore } from '@/store'
import toast from 'react-hot-toast'

export default function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { user } = useStore()
  const queryClient = useQueryClient()
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const res = await fetch(`/api/articles/${id}`)
      if (!res.ok) throw new Error('Article not found')
      return res.json() as Promise<ArticleWithDetails>
    },
  })

  const voteMutation = useMutation({
    mutationFn: async (biasLabel: BiasLabel) => {
      if (!user) throw new Error('Please sign in to vote')
      const res = await fetch(`/api/articles/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, biasLabel }),
      })
      if (!res.ok) throw new Error('Failed to vote')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article', id] })
      toast.success('Vote recorded!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const noteMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('Please sign in to add notes')
      const res = await fetch(`/api/articles/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, content }),
      })
      if (!res.ok) throw new Error('Failed to add note')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article', id] })
      toast.success('Note submitted for review!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const analyzeArticle = async () => {
    setIsAnalyzing(true)
    try {
      const res = await fetch(`/api/articles/${id}/analyze`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to analyze')
      queryClient.invalidateQueries({ queryKey: ['article', id] })
      toast.success('Article analyzed!')
    } catch (error) {
      toast.error('Failed to analyze article')
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Article not found
        </h1>
        <Link href="/">
          <Button className="mt-4">Back to Feed</Button>
        </Link>
      </div>
    )
  }

  const biasScore = article.communityBiasScore ?? article.aiBiasScore ?? 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feed
        </Button>
      </Link>

      {/* Article Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {/* Source & Category */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {article.source && (
            <Badge variant="secondary">{article.source.name}</Badge>
          )}
          <Badge variant="outline">{article.category}</Badge>
          {article.aiPredictedBias && (
            <Badge
              variant={article.aiPredictedBias.toLowerCase() as any}
              className="flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" />
              AI: {article.aiPredictedBias}
            </Badge>
          )}
        </div>

        {/* Headline */}
        <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white md:text-4xl">
          {article.headline}
        </h1>

        {/* Meta */}
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          {article.authors && (
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {article.authors}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(article.publishedAt)}
          </span>
          {article.readingTimeMinutes && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.readingTimeMinutes} min read
            </span>
          )}
        </div>

        {/* Image */}
        {article.imageUrl && (
          <div className="mb-6 overflow-hidden rounded-xl">
            <img
              src={article.imageUrl}
              alt={article.headline}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        {/* Description */}
        <p className="mb-6 text-lg text-zinc-700 dark:text-zinc-300">
          {article.shortDescription}
        </p>

        {/* External Link */}
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Read full article
          <ExternalLink className="h-4 w-4" />
        </a>
      </motion.div>

      {/* Entity Tags */}
      {article.entities && article.entities.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Mentioned Entities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {article.entities.map((ae) => (
                <Badge
                  key={ae.entity.id}
                  variant={ae.entity.type.toLowerCase() as any}
                  className="flex items-center gap-1"
                >
                  {ae.entity.name}
                  {ae.sentiment === 'POSITIVE' && (
                    <span className="text-green-500">+</span>
                  )}
                  {ae.sentiment === 'NEGATIVE' && (
                    <span className="text-red-500">-</span>
                  )}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bias Analysis */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Bias Analysis</CardTitle>
          {!article.aiPredictedBias && (
            <Button
              variant="outline"
              size="sm"
              onClick={analyzeArticle}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Analyze with AI
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <BiasSpectrum score={biasScore} size="lg" className="mb-6" />

          {article.aiAnalysis && (
            <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400">
                <Sparkles className="h-4 w-4" />
                AI Analysis
                {article.aiConfidence && (
                  <span className="text-xs opacity-70">
                    ({article.aiConfidence.toFixed(0)}% confidence)
                  </span>
                )}
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                {article.aiAnalysis}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {BIAS_LABELS.map((bias) => {
              const key = bias.value.toLowerCase() as
                | 'socialist'
                | 'liberal'
                | 'moderate'
                | 'conservative'
                | 'libertarian'
                | 'autocratic'
              const count =
                article[
                  `votes${bias.value.charAt(0) + bias.value.slice(1).toLowerCase()}` as keyof typeof article
                ] as number
              return (
                <BiasBar
                  key={bias.value}
                  label={bias.label}
                  count={count}
                  total={article.totalVotes}
                  color={bias.color}
                />
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Voting */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Cast Your Vote</CardTitle>
        </CardHeader>
        <CardContent>
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
            onVote={(bias) => voteMutation.mutate(bias)}
            isLoading={voteMutation.isPending}
          />
        </CardContent>
      </Card>

      {/* Claims */}
      {article.claims && article.claims.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Verifiable Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {article.claims.map((claim) => (
                <div
                  key={claim.id}
                  className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700"
                >
                  {claim.verificationStatus === 'TRUE' && (
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  )}
                  {claim.verificationStatus === 'FALSE' && (
                    <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                  )}
                  {claim.verificationStatus === 'UNVERIFIED' && (
                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      {claim.text}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant={
                          claim.verificationStatus === 'TRUE'
                            ? 'verified'
                            : claim.verificationStatus === 'FALSE'
                              ? 'destructive'
                              : 'secondary'
                        }
                        className="text-xs"
                      >
                        {claim.verificationStatus}
                      </Badge>
                      {claim.factCheckUrl && (
                        <a
                          href={claim.factCheckUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Source: {claim.factCheckSource}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Community Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Community Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {article.communityNotes?.map((note) => (
              <CommunityNote key={note.id} note={note} />
            ))}
            {(!article.communityNotes ||
              article.communityNotes.length === 0) && (
              <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                No community notes yet. Be the first to add context!
              </p>
            )}
            <AddCommunityNote
              articleId={article.id}
              onSubmit={(content) => noteMutation.mutateAsync(content)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
