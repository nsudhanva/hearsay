import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateBiasScore } from '@/lib/utils'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params
    const body = await request.json()
    const { userId, biasLabel } = body

    if (!userId || !biasLabel) {
      return NextResponse.json(
        { error: 'userId and biasLabel are required' },
        { status: 400 }
      )
    }

    const validLabels = [
      'SOCIALIST',
      'LIBERAL',
      'MODERATE',
      'CONSERVATIVE',
      'LIBERTARIAN',
      'AUTOCRATIC',
    ]
    if (!validLabels.includes(biasLabel)) {
      return NextResponse.json({ error: 'Invalid bias label' }, { status: 400 })
    }

    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Check for existing vote
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    })

    // Determine vote field to update
    const voteField = `votes${biasLabel.charAt(0) + biasLabel.slice(1).toLowerCase()}` as
      | 'votesSocialist'
      | 'votesLiberal'
      | 'votesModerate'
      | 'votesConservative'
      | 'votesLibertarian'
      | 'votesAutocratic'

    if (existingVote) {
      // Update existing vote
      const oldVoteField = `votes${existingVote.biasLabel.charAt(0) + existingVote.biasLabel.slice(1).toLowerCase()}` as typeof voteField

      await prisma.$transaction([
        prisma.vote.update({
          where: { id: existingVote.id },
          data: { biasLabel },
        }),
        prisma.article.update({
          where: { id: articleId },
          data: {
            [oldVoteField]: { decrement: 1 },
            [voteField]: { increment: 1 },
          },
        }),
      ])
    } else {
      // Create new vote
      await prisma.$transaction([
        prisma.vote.create({
          data: {
            userId,
            articleId,
            biasLabel,
          },
        }),
        prisma.article.update({
          where: { id: articleId },
          data: {
            [voteField]: { increment: 1 },
            totalVotes: { increment: 1 },
          },
        }),
      ])
    }

    // Recalculate community bias score
    const updatedArticle = await prisma.article.findUnique({
      where: { id: articleId },
    })

    if (updatedArticle) {
      const communityBiasScore = calculateBiasScore({
        socialist: updatedArticle.votesSocialist,
        liberal: updatedArticle.votesLiberal,
        moderate: updatedArticle.votesModerate,
        conservative: updatedArticle.votesConservative,
        libertarian: updatedArticle.votesLibertarian,
        autocratic: updatedArticle.votesAutocratic,
      })

      await prisma.article.update({
        where: { id: articleId },
        data: { communityBiasScore },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error voting:', error)
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 })
  }
}
