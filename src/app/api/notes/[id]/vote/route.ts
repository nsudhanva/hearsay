import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: noteId } = await params
    const body = await request.json()
    const { userId, helpful } = body

    if (!userId || typeof helpful !== 'boolean') {
      return NextResponse.json(
        { error: 'userId and helpful (boolean) are required' },
        { status: 400 }
      )
    }

    const note = await prisma.communityNote.findUnique({
      where: { id: noteId },
    })

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    // Check for existing vote
    const existingVote = await prisma.noteVote.findUnique({
      where: {
        userId_noteId: {
          userId,
          noteId,
        },
      },
    })

    if (existingVote) {
      if (existingVote.helpful === helpful) {
        // Remove vote if same
        await prisma.$transaction([
          prisma.noteVote.delete({
            where: { id: existingVote.id },
          }),
          prisma.communityNote.update({
            where: { id: noteId },
            data: helpful
              ? { helpfulVotes: { decrement: 1 } }
              : { notHelpfulVotes: { decrement: 1 } },
          }),
        ])
      } else {
        // Change vote
        await prisma.$transaction([
          prisma.noteVote.update({
            where: { id: existingVote.id },
            data: { helpful },
          }),
          prisma.communityNote.update({
            where: { id: noteId },
            data: helpful
              ? { helpfulVotes: { increment: 1 }, notHelpfulVotes: { decrement: 1 } }
              : { helpfulVotes: { decrement: 1 }, notHelpfulVotes: { increment: 1 } },
          }),
        ])
      }
    } else {
      // Create new vote
      await prisma.$transaction([
        prisma.noteVote.create({
          data: {
            userId,
            noteId,
            helpful,
          },
        }),
        prisma.communityNote.update({
          where: { id: noteId },
          data: helpful
            ? { helpfulVotes: { increment: 1 } }
            : { notHelpfulVotes: { increment: 1 } },
        }),
      ])
    }

    // Auto-approve notes with high helpful ratio
    const updatedNote = await prisma.communityNote.findUnique({
      where: { id: noteId },
    })

    if (updatedNote && updatedNote.status === 'PENDING') {
      const totalVotes = updatedNote.helpfulVotes + updatedNote.notHelpfulVotes
      const helpfulRatio = totalVotes > 0 ? updatedNote.helpfulVotes / totalVotes : 0

      if (totalVotes >= 5 && helpfulRatio >= 0.7) {
        await prisma.communityNote.update({
          where: { id: noteId },
          data: { status: 'APPROVED' },
        })
      } else if (totalVotes >= 5 && helpfulRatio <= 0.3) {
        await prisma.communityNote.update({
          where: { id: noteId },
          data: { status: 'REJECTED' },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error voting on note:', error)
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 })
  }
}
