'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Loader2, ExternalLink, Shield, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BiasSpectrum } from '@/components/ui/bias-spectrum'
import { cn } from '@/lib/utils'

export default function SourcesPage() {
  const { data: sources, isLoading } = useQuery({
    queryKey: ['sources'],
    queryFn: async () => {
      const res = await fetch('/api/sources')
      return res.json()
    },
  })

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
        className="mb-8"
      >
        <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
          News Sources
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Credibility and bias ratings for news outlets based on community
          feedback
        </p>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span className="text-zinc-600 dark:text-zinc-400">
              High Credibility (70+)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-zinc-600 dark:text-zinc-400">
              Medium Credibility (40-70)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-zinc-600 dark:text-zinc-400">
              Low Credibility (&lt;40)
            </span>
          </div>
        </div>
      </motion.div>

      {/* Sources Grid */}
      {sources && sources.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sources.map((source: any, index: number) => (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{source.name}</CardTitle>
                    {source.credibilityScore >= 70 && (
                      <Shield className="h-5 w-5 text-green-500" />
                    )}
                    {source.credibilityScore >= 40 &&
                      source.credibilityScore < 70 && (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      )}
                    {source.credibilityScore < 40 && (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  {source.description && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {source.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {/* Credibility Score */}
                  <div className="mb-4">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Credibility Score
                      </span>
                      <span
                        className={cn(
                          'font-semibold',
                          source.credibilityScore >= 70 && 'text-green-600',
                          source.credibilityScore >= 40 &&
                            source.credibilityScore < 70 &&
                            'text-amber-600',
                          source.credibilityScore < 40 && 'text-red-600'
                        )}
                      >
                        {source.credibilityScore.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          source.credibilityScore >= 70 && 'bg-green-500',
                          source.credibilityScore >= 40 &&
                            source.credibilityScore < 70 &&
                            'bg-amber-500',
                          source.credibilityScore < 40 && 'bg-red-500'
                        )}
                        style={{ width: `${source.credibilityScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Bias Rating */}
                  <div className="mb-4">
                    <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
                      Political Lean
                    </p>
                    <BiasSpectrum
                      score={source.biasRating}
                      size="sm"
                      showLabels={false}
                    />
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-700">
                    <Badge variant="secondary">
                      {source.articleCount} articles
                    </Badge>
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Visit
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            No sources tracked yet. Add articles to see source ratings.
          </p>
        </div>
      )}
    </div>
  )
}
