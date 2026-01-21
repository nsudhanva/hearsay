import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const sources = await prisma.source.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { articleCount: 'desc' },
    })

    return NextResponse.json(
      sources.map((s) => ({
        ...s,
        articleCount: s._count.articles,
      }))
    )
  } catch (error) {
    console.error('Error fetching sources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sources' },
      { status: 500 }
    )
  }
}
