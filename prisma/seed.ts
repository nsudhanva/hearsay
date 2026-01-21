import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const sampleArticles = [
  {
    headline: 'Biden Administration Announces New Climate Initiatives',
    shortDescription:
      'The White House unveiled a comprehensive plan to combat climate change, including new regulations on carbon emissions and investments in renewable energy.',
    sourceUrl: 'https://example.com/biden-climate',
    imageUrl: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800',
    authors: 'Sarah Johnson',
    category: 'POLITICS',
    aiPredictedBias: 'LIBERAL',
    aiBiasScore: -45,
    aiConfidence: 78,
    aiAnalysis: 'The article uses language favorable to environmental regulations and emphasizes positive outcomes of government intervention.',
    votesSocialist: 12,
    votesLiberal: 45,
    votesModerate: 23,
    votesConservative: 8,
    votesLibertarian: 3,
    votesAutocratic: 1,
    totalVotes: 92,
    communityBiasScore: -35,
  },
  {
    headline: 'Supreme Court Rules on Second Amendment Case',
    shortDescription:
      'In a landmark decision, the Supreme Court expanded gun rights, striking down a state law that required permits to carry concealed weapons.',
    sourceUrl: 'https://example.com/scotus-guns',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
    authors: 'Michael Chen',
    category: 'POLITICS',
    aiPredictedBias: 'CONSERVATIVE',
    aiBiasScore: 55,
    aiConfidence: 82,
    aiAnalysis: 'The article frames the ruling positively for gun rights advocates and emphasizes constitutional originalism.',
    votesSocialist: 2,
    votesLiberal: 15,
    votesModerate: 28,
    votesConservative: 67,
    votesLibertarian: 35,
    votesAutocratic: 5,
    totalVotes: 152,
    communityBiasScore: 48,
  },
  {
    headline: 'Congress Debates Infrastructure Bill Funding',
    shortDescription:
      'Lawmakers from both parties discussed the merits and drawbacks of the proposed infrastructure spending, with disagreements on how to pay for it.',
    sourceUrl: 'https://example.com/infrastructure-debate',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800',
    authors: 'Emily Rodriguez',
    category: 'POLITICS',
    aiPredictedBias: 'MODERATE',
    aiBiasScore: 5,
    aiConfidence: 85,
    aiAnalysis: 'The article presents balanced coverage of both partisan perspectives without favoring either side.',
    votesSocialist: 8,
    votesLiberal: 22,
    votesModerate: 78,
    votesConservative: 25,
    votesLibertarian: 12,
    votesAutocratic: 2,
    totalVotes: 147,
    communityBiasScore: 3,
  },
  {
    headline: 'Progressive Democrats Push for Medicare Expansion',
    shortDescription:
      'A coalition of progressive lawmakers introduced legislation to lower the Medicare eligibility age and expand coverage to include dental and vision.',
    sourceUrl: 'https://example.com/medicare-expansion',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    authors: 'James Wilson',
    category: 'POLITICS',
    aiPredictedBias: 'SOCIALIST',
    aiBiasScore: -78,
    aiConfidence: 75,
    aiAnalysis: 'The article strongly advocates for expanded government healthcare programs and uses language supportive of progressive policy goals.',
    votesSocialist: 45,
    votesLiberal: 38,
    votesModerate: 12,
    votesConservative: 5,
    votesLibertarian: 2,
    votesAutocratic: 0,
    totalVotes: 102,
    communityBiasScore: -65,
  },
  {
    headline: 'Republican Governors Challenge Federal Vaccine Mandates',
    shortDescription:
      'Several Republican governors filed lawsuits against the Biden administration workplace vaccine requirements, citing states rights and individual liberty.',
    sourceUrl: 'https://example.com/vaccine-lawsuits',
    imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800',
    authors: 'Lisa Thompson',
    category: 'POLITICS',
    aiPredictedBias: 'LIBERTARIAN',
    aiBiasScore: 72,
    aiConfidence: 80,
    aiAnalysis: 'The article emphasizes individual liberty and states rights over federal authority, consistent with libertarian framing.',
    votesSocialist: 1,
    votesLiberal: 8,
    votesModerate: 15,
    votesConservative: 42,
    votesLibertarian: 55,
    votesAutocratic: 8,
    totalVotes: 129,
    communityBiasScore: 62,
  },
  {
    headline: 'Tech Giants Face Antitrust Scrutiny from Both Parties',
    shortDescription:
      'Bipartisan support grows for legislation aimed at breaking up major technology companies, with concerns about market dominance and data privacy.',
    sourceUrl: 'https://example.com/tech-antitrust',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    authors: 'David Park',
    category: 'POLITICS',
    aiPredictedBias: 'MODERATE',
    aiBiasScore: -8,
    aiConfidence: 88,
    aiAnalysis: 'The article presents bipartisan concerns equally and does not favor either political perspectives approach to regulation.',
    votesSocialist: 15,
    votesLiberal: 35,
    votesModerate: 89,
    votesConservative: 32,
    votesLibertarian: 18,
    votesAutocratic: 3,
    totalVotes: 192,
    communityBiasScore: -5,
  },
  {
    headline: 'Immigration Reform Stalls in Senate',
    shortDescription:
      'Efforts to pass comprehensive immigration reform hit another roadblock as senators failed to reach agreement on border security provisions.',
    sourceUrl: 'https://example.com/immigration-stall',
    imageUrl: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=800',
    authors: 'Maria Garcia',
    category: 'POLITICS',
    aiPredictedBias: 'LIBERAL',
    aiBiasScore: -38,
    aiConfidence: 72,
    aiAnalysis: 'The article frames immigration reform positively and characterizes opposition as obstructionist.',
    votesSocialist: 8,
    votesLiberal: 52,
    votesModerate: 35,
    votesConservative: 18,
    votesLibertarian: 7,
    votesAutocratic: 2,
    totalVotes: 122,
    communityBiasScore: -28,
  },
  {
    headline: 'State Lawmakers Pass Restrictive Voting Legislation',
    shortDescription:
      'The state legislature approved new election laws requiring photo ID and limiting early voting hours, sparking debate over voter access.',
    sourceUrl: 'https://example.com/voting-laws',
    imageUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800',
    authors: 'Robert Taylor',
    category: 'POLITICS',
    aiPredictedBias: 'CONSERVATIVE',
    aiBiasScore: 48,
    aiConfidence: 76,
    aiAnalysis: 'The article frames election security measures positively while minimizing concerns about voter access.',
    votesSocialist: 3,
    votesLiberal: 12,
    votesModerate: 25,
    votesConservative: 58,
    votesLibertarian: 22,
    votesAutocratic: 8,
    totalVotes: 128,
    communityBiasScore: 45,
  },
  {
    headline: 'Workers Strike at Major Manufacturing Plants',
    shortDescription:
      'Thousands of workers walked off the job demanding higher wages and better working conditions, marking the largest labor action in decades.',
    sourceUrl: 'https://example.com/workers-strike',
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800',
    authors: 'Jennifer Adams',
    category: 'POLITICS',
    aiPredictedBias: 'SOCIALIST',
    aiBiasScore: -82,
    aiConfidence: 84,
    aiAnalysis: 'The article strongly supports labor organizing and frames corporate management negatively.',
    votesSocialist: 62,
    votesLiberal: 45,
    votesModerate: 18,
    votesConservative: 5,
    votesLibertarian: 3,
    votesAutocratic: 1,
    totalVotes: 134,
    communityBiasScore: -72,
  },
  {
    headline: 'Federal Reserve Signals Interest Rate Decision',
    shortDescription:
      'The Federal Reserve indicated it may adjust interest rates in response to inflation concerns, with economists divided on the implications.',
    sourceUrl: 'https://example.com/fed-rates',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    authors: 'William Brown',
    category: 'POLITICS',
    aiPredictedBias: 'MODERATE',
    aiBiasScore: 2,
    aiConfidence: 90,
    aiAnalysis: 'The article provides objective coverage of monetary policy without political framing.',
    votesSocialist: 5,
    votesLiberal: 28,
    votesModerate: 95,
    votesConservative: 32,
    votesLibertarian: 15,
    votesAutocratic: 2,
    totalVotes: 177,
    communityBiasScore: 0,
  },
]

const sampleSources = [
  { name: 'The Daily Herald', credibilityScore: 75, biasRating: -25 },
  { name: 'National Tribune', credibilityScore: 82, biasRating: 35 },
  { name: 'Independent News Network', credibilityScore: 88, biasRating: 0 },
  { name: 'Progressive Voice', credibilityScore: 65, biasRating: -55 },
  { name: 'Liberty Watch', credibilityScore: 70, biasRating: 65 },
]

const sampleEntities = [
  { name: 'Joe Biden', type: 'POLITICIAN', politicalLean: -40 },
  { name: 'Donald Trump', type: 'POLITICIAN', politicalLean: 60 },
  { name: 'Democratic Party', type: 'PARTY', politicalLean: -45 },
  { name: 'Republican Party', type: 'PARTY', politicalLean: 50 },
  { name: 'California', type: 'STATE', politicalLean: -35 },
  { name: 'Texas', type: 'STATE', politicalLean: 40 },
  { name: 'Florida', type: 'STATE', politicalLean: 25 },
  { name: 'New York', type: 'STATE', politicalLean: -30 },
  { name: 'Supreme Court', type: 'ORGANIZATION', politicalLean: 15 },
  { name: 'Congress', type: 'ORGANIZATION', politicalLean: 0 },
]

async function main() {
  console.log('Seeding database...')

  // Create demo user
  const passwordHash = await bcrypt.hash('demo123', 10)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@hearsay.ai' },
    update: {},
    create: {
      email: 'demo@hearsay.ai',
      name: 'Demo User',
      passwordHash,
    },
  })
  console.log('Created demo user:', demoUser.email)

  // Create sources
  for (const source of sampleSources) {
    await prisma.source.upsert({
      where: { name: source.name },
      update: source,
      create: source,
    })
  }
  console.log('Created sources')

  // Create entities
  for (const entity of sampleEntities) {
    await prisma.entity.upsert({
      where: { name: entity.name },
      update: entity,
      create: entity,
    })
  }
  console.log('Created entities')

  // Get sources for articles
  const sources = await prisma.source.findMany()

  // Create articles
  for (let i = 0; i < sampleArticles.length; i++) {
    const articleData = sampleArticles[i]
    const source = sources[i % sources.length]

    const article = await prisma.article.upsert({
      where: { sourceUrl: articleData.sourceUrl },
      update: {},
      create: {
        ...articleData,
        publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Stagger dates
        sourceId: source.id,
        wordCount: Math.floor(Math.random() * 1000) + 500,
        readingTimeMinutes: Math.floor(Math.random() * 5) + 2,
        aiAnalyzedAt: new Date(),
      },
    })

    // Add random entity associations
    const entities = await prisma.entity.findMany()
    const randomEntities = entities
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 1)

    for (const entity of randomEntities) {
      await prisma.articleEntity.upsert({
        where: {
          articleId_entityId: {
            articleId: article.id,
            entityId: entity.id,
          },
        },
        update: {},
        create: {
          articleId: article.id,
          entityId: entity.id,
          sentiment: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'][
            Math.floor(Math.random() * 3)
          ],
          mentions: Math.floor(Math.random() * 5) + 1,
        },
      })
    }

    // Add sample community note to some articles
    if (i % 3 === 0) {
      await prisma.communityNote.create({
        data: {
          articleId: article.id,
          userId: demoUser.id,
          content:
            'This article provides important context but readers should be aware of the source\'s editorial stance. Consider reading coverage from multiple outlets for a balanced perspective.',
          status: 'APPROVED',
          helpfulVotes: Math.floor(Math.random() * 50) + 10,
          notHelpfulVotes: Math.floor(Math.random() * 10),
        },
      })
    }

    // Add sample claims
    await prisma.claim.create({
      data: {
        articleId: article.id,
        text: 'A factual claim from the article that could be verified.',
        verificationStatus: ['UNVERIFIED', 'TRUE', 'FALSE', 'PARTIALLY_TRUE'][
          Math.floor(Math.random() * 4)
        ],
      },
    })
  }
  console.log('Created articles with entities and notes')

  // Update source article counts
  for (const source of sources) {
    const count = await prisma.article.count({
      where: { sourceId: source.id },
    })
    await prisma.source.update({
      where: { id: source.id },
      data: { articleCount: count },
    })
  }
  console.log('Updated source article counts')

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
