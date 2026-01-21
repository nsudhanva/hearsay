'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BIAS_LABELS } from '@/types'

export default function SpectrumPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['articles-spectrum'],
    queryFn: async () => {
      const res = await fetch('/api/articles?limit=100')
      return res.json()
    },
  })

  const articles = data?.articles || []

  // Group articles by bias
  const groupedArticles = BIAS_LABELS.map((bias) => ({
    ...bias,
    articles: articles.filter(
      (a: any) =>
        a.aiPredictedBias === bias.value ||
        (!a.aiPredictedBias && getDefaultBias(a.communityBiasScore) === bias.value)
    ),
  }))

  function getDefaultBias(score: number | null): string {
    if (score === null) return 'MODERATE'
    if (score <= -75) return 'SOCIALIST'
    if (score <= -25) return 'LIBERAL'
    if (score <= 25) return 'MODERATE'
    if (score <= 60) return 'CONSERVATIVE'
    if (score <= 85) return 'LIBERTARIAN'
    return 'AUTOCRATIC'
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
          Political Spectrum View
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          See all articles organized by their political bias classification
        </p>
      </motion.div>

      {/* Spectrum Gradient Bar */}
      <div className="mb-8 h-4 w-full overflow-hidden rounded-full bias-gradient" />

      {/* Spectrum Columns */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {groupedArticles.map((group, index) => (
          <motion.div
            key={group.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <Badge variant={group.value.toLowerCase() as any}>
                    {group.label}
                  </Badge>
                  <span className="text-sm font-normal text-zinc-500">
                    {group.articles.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                  {group.articles.length === 0 ? (
                    <p className="text-sm text-zinc-400">No articles</p>
                  ) : (
                    group.articles.slice(0, 10).map((article: any) => (
                      <Link
                        key={article.id}
                        href={`/article/${article.id}`}
                        className="block rounded-lg border border-zinc-200 p-2 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                      >
                        <p className="line-clamp-2 text-xs font-medium text-zinc-800 dark:text-zinc-200">
                          {article.headline}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {article.totalVotes} votes
                        </p>
                      </Link>
                    ))
                  )}
                  {group.articles.length > 10 && (
                    <p className="text-center text-xs text-zinc-400">
                      +{group.articles.length - 10} more
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
          Understanding the Spectrum
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {BIAS_LABELS.map((bias) => (
            <div key={bias.value} className="flex items-start gap-3">
              <Badge variant={bias.value.toLowerCase() as any}>
                {bias.label}
              </Badge>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {bias.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
