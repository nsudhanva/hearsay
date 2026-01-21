import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { analyzeArticleBias } from '@/lib/openai'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Analyze with OpenAI
    const analysis = await analyzeArticleBias(
      article.headline,
      article.shortDescription,
      article.content || undefined
    )

    // Update article with AI analysis
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        aiPredictedBias: analysis.predictedBias,
        aiBiasScore: analysis.biasScore,
        aiConfidence: analysis.confidence,
        aiAnalysis: analysis.analysis,
        aiAnalyzedAt: new Date(),
      },
    })

    // Create/update entities
    for (const entityData of analysis.entities) {
      const entity = await prisma.entity.upsert({
        where: { name: entityData.name },
        update: {},
        create: {
          name: entityData.name,
          type: entityData.type,
        },
      })

      await prisma.articleEntity.upsert({
        where: {
          articleId_entityId: {
            articleId,
            entityId: entity.id,
          },
        },
        update: {
          sentiment: entityData.sentiment,
          mentions: { increment: 1 },
        },
        create: {
          articleId,
          entityId: entity.id,
          sentiment: entityData.sentiment,
        },
      })
    }

    // Create claims
    for (const claimData of analysis.claims) {
      await prisma.claim.create({
        data: {
          articleId,
          text: claimData.text,
          verificationStatus: 'UNVERIFIED',
        },
      })
    }

    return NextResponse.json({
      article: updatedArticle,
      analysis,
    })
  } catch (error) {
    console.error('Error analyzing article:', error)
    return NextResponse.json(
      { error: 'Failed to analyze article' },
      { status: 500 }
    )
  }
}
