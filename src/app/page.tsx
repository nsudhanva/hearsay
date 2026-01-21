'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  TrendingUp,
  Sparkles,
  RefreshCw,
  ChevronDown,
} from 'lucide-react'
import { ArticleCard } from '@/components/article/article-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BiasSpectrum } from '@/components/ui/bias-spectrum'
import { ArticleWithDetails, BiasLabel, BIAS_LABELS } from '@/types'
import { useStore } from '@/store'
import toast from 'react-hot-toast'

export default function HomePage() {
  const { user } = useStore()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [selectedBias, setSelectedBias] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['articles', search, selectedBias],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (selectedBias) params.set('bias', selectedBias)
      const res = await fetch(`/api/articles?${params}`)
      return res.json()
    },
  })

  const voteMutation = useMutation({
    mutationFn: async ({
      articleId,
      biasLabel,
    }: {
      articleId: string
      biasLabel: BiasLabel
    }) => {
      if (!user) {
        throw new Error('Please sign in to vote')
      }
      const res = await fetch(`/api/articles/${articleId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, biasLabel }),
      })
      if (!res.ok) throw new Error('Failed to vote')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      toast.success('Vote recorded!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleVote = async (articleId: string, biasLabel: BiasLabel) => {
    await voteMutation.mutateAsync({ articleId, biasLabel })
  }

  const articles: ArticleWithDetails[] = data?.articles || []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-2 text-4xl font-bold text-zinc-900 dark:text-white">
          Transparent News
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          See through the bias. AI-powered analysis combined with community
          insights to help you understand the political lean of news articles.
        </p>
      </motion.div>

      {/* Platform Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {[
          {
            label: 'Articles Analyzed',
            value: data?.pagination?.total || 0,
            icon: Sparkles,
          },
          { label: 'Community Votes', value: '10K+', icon: TrendingUp },
          { label: 'AI Accuracy', value: '~85%', icon: Sparkles },
          { label: 'Active Users', value: '500+', icon: TrendingUp },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <stat.icon className="mb-2 h-5 w-5 text-blue-500" />
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Political Spectrum Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
          Political Spectrum
        </h2>
        <BiasSpectrum score={0} size="lg" />
        <div className="mt-4 flex flex-wrap justify-between gap-2">
          {BIAS_LABELS.map((bias) => (
            <Badge
              key={bias.value}
              variant={bias.value.toLowerCase() as any}
              className="cursor-pointer"
              onClick={() =>
                setSelectedBias(selectedBias === bias.value ? null : bias.value)
              }
            >
              {bias.label}
            </Badge>
          ))}
        </div>
      </motion.div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
            />
          </Button>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Chips */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 flex flex-wrap gap-2"
        >
          <Button
            variant={selectedBias === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedBias(null)}
          >
            All
          </Button>
          {BIAS_LABELS.map((bias) => (
            <Button
              key={bias.value}
              variant={selectedBias === bias.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedBias(bias.value)}
            >
              {bias.label}
            </Button>
          ))}
        </motion.div>
      )}

      {/* Articles Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-96 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
            />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            No articles found. Try adjusting your filters or seed the database.
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            Run: <code className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">npm run seed</code>
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ArticleCard article={article} onVote={handleVote} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Load More */}
      {data?.pagination?.totalPages > 1 && (
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg">
            Load More Articles
          </Button>
        </div>
      )}
    </div>
  )
}
