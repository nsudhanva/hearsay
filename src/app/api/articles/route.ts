import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const bias = searchParams.get('bias')
    const source = searchParams.get('source')
    const search = searchParams.get('search')

    const where: any = {}

    if (category) {
      where.category = category
    }

    if (bias) {
      where.aiPredictedBias = bias
    }

    if (source) {
      where.sourceId = source
    }

    if (search) {
      where.OR = [
        { headline: { contains: search } },
        { shortDescription: { contains: search } },
      ]
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          source: {
            select: {
              id: true,
              name: true,
              credibilityScore: true,
              biasRating: true,
            },
          },
          entities: {
            include: {
              entity: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  politicalLean: true,
                },
              },
            },
          },
          communityNotes: {
            where: { status: 'APPROVED' },
            include: {
              user: { select: { name: true } },
            },
            orderBy: { helpfulVotes: 'desc' },
            take: 1,
          },
          _count: {
            select: { communityNotes: true },
          },
        },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.article.count({ where }),
    ])

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      headline,
      shortDescription,
      content,
      sourceUrl,
      imageUrl,
      authors,
      category,
      publishedAt,
      sourceName,
    } = body

    // Find or create source
    let source = null
    if (sourceName) {
      source = await prisma.source.upsert({
        where: { name: sourceName },
        update: { articleCount: { increment: 1 } },
        create: { name: sourceName, articleCount: 1 },
      })
    }

    const article = await prisma.article.create({
      data: {
        headline,
        shortDescription,
        content,
        sourceUrl,
        imageUrl,
        authors,
        category: category || 'POLITICS',
        publishedAt: new Date(publishedAt || Date.now()),
        sourceId: source?.id,
        wordCount: content ? content.split(/\s+/).length : undefined,
        readingTimeMinutes: content
          ? Math.ceil(content.split(/\s+/).length / 200)
          : undefined,
      },
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}
