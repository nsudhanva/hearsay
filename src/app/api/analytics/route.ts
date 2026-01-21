import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get overall statistics
    const [
      totalArticles,
      totalVotes,
      totalNotes,
      biasDistribution,
      recentArticles,
      topSources,
      topEntities,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.vote.count(),
      prisma.communityNote.count(),
      prisma.article.groupBy({
        by: ['aiPredictedBias'],
        _count: { id: true },
        where: { aiPredictedBias: { not: null } },
      }),
      prisma.article.findMany({
        select: {
          id: true,
          headline: true,
          publishedAt: true,
          totalVotes: true,
          aiPredictedBias: true,
          communityBiasScore: true,
        },
        orderBy: { publishedAt: 'desc' },
        take: 10,
      }),
      prisma.source.findMany({
        select: {
          id: true,
          name: true,
          credibilityScore: true,
          biasRating: true,
          articleCount: true,
        },
        orderBy: { articleCount: 'desc' },
        take: 10,
      }),
      prisma.entity.findMany({
        select: {
          id: true,
          name: true,
          type: true,
          _count: { select: { articles: true } },
        },
        orderBy: { articles: { _count: 'desc' } },
        take: 10,
      }),
    ])

    // Calculate average bias score
    const articlesWithBias = await prisma.article.findMany({
      where: { communityBiasScore: { not: null } },
      select: { communityBiasScore: true },
    })

    const avgBiasScore =
      articlesWithBias.length > 0
        ? articlesWithBias.reduce((sum, a) => sum + (a.communityBiasScore || 0), 0) /
          articlesWithBias.length
        : 0

    // Vote distribution over time (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const votesByDay = await prisma.vote.groupBy({
      by: ['biasLabel'],
      _count: { id: true },
      where: { createdAt: { gte: sevenDaysAgo } },
    })

    return NextResponse.json({
      summary: {
        totalArticles,
        totalVotes,
        totalNotes,
        avgBiasScore,
      },
      biasDistribution: biasDistribution.map((b) => ({
        bias: b.aiPredictedBias,
        count: b._count.id,
      })),
      recentArticles,
      topSources,
      topEntities: topEntities.map((e) => ({
        ...e,
        articleCount: e._count.articles,
      })),
      votesByBias: votesByDay.map((v) => ({
        bias: v.biasLabel,
        count: v._count.id,
      })),
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
