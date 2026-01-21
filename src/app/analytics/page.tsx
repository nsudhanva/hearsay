'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Loader2, TrendingUp, Users, FileText, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BiasSpectrum } from '@/components/ui/bias-spectrum'
import { BIAS_LABELS } from '@/types'

const COLORS = ['#DC2626', '#2563EB', '#8B5CF6', '#EF4444', '#F59E0B', '#1F2937']

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await fetch('/api/analytics')
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

  const biasData =
    data?.biasDistribution?.map((b: any) => ({
      name: b.bias || 'Unknown',
      value: b.count,
      color: BIAS_LABELS.find((l) => l.value === b.bias)?.color || '#6B7280',
    })) || []

  const voteData =
    data?.votesByBias?.map((v: any) => ({
      name: v.bias,
      votes: v.count,
    })) || []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
          Platform Analytics
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Insights into bias distribution and community engagement
        </p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                {data?.summary?.totalArticles || 0}
              </p>
              <p className="text-sm text-zinc-500">Total Articles</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                {data?.summary?.totalVotes || 0}
              </p>
              <p className="text-sm text-zinc-500">Total Votes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
              <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                {data?.summary?.totalNotes || 0}
              </p>
              <p className="text-sm text-zinc-500">Community Notes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
              <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                {data?.summary?.avgBiasScore?.toFixed(1) || 0}
              </p>
              <p className="text-sm text-zinc-500">Avg Bias Score</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Average Platform Bias */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Platform Bias Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <BiasSpectrum
              score={data?.summary?.avgBiasScore || 0}
              size="lg"
              className="mb-4"
            />
            <p className="text-center text-sm text-zinc-500">
              Average community bias score across all articles
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Bias Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>AI Predicted Bias Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {biasData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={biasData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                    >
                      {biasData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-12 text-center text-zinc-500">
                  No data available. Analyze some articles first.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Vote Distribution Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Community Votes (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              {voteData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={voteData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-12 text-center text-zinc-500">
                  No votes recorded yet.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Entities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Most Mentioned Entities</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.topEntities && data.topEntities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.topEntities.map((entity: any) => (
                  <Badge
                    key={entity.id}
                    variant={entity.type.toLowerCase() as any}
                    className="text-sm"
                  >
                    {entity.name} ({entity.articleCount})
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-center text-zinc-500">
                No entities extracted yet.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Top News Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.topSources && data.topSources.length > 0 ? (
              <div className="space-y-3">
                {data.topSources.map((source: any) => (
                  <div
                    key={source.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 dark:border-zinc-700"
                  >
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">
                        {source.name}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {source.articleCount} articles
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Credibility: {source.credibilityScore.toFixed(0)}%
                      </p>
                      <BiasSpectrum
                        score={source.biasRating}
                        size="sm"
                        showLabels={false}
                        className="w-24"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-zinc-500">No sources tracked yet.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
