export type BiasLabel =
  | 'SOCIALIST'
  | 'LIBERAL'
  | 'MODERATE'
  | 'CONSERVATIVE'
  | 'LIBERTARIAN'
  | 'AUTOCRATIC'

export type EntityType = 'POLITICIAN' | 'PARTY' | 'STATE' | 'ORGANIZATION'

export type VerificationStatus =
  | 'UNVERIFIED'
  | 'TRUE'
  | 'FALSE'
  | 'MISLEADING'
  | 'PARTIALLY_TRUE'

export type NoteStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface BiasVotes {
  socialist: number
  liberal: number
  moderate: number
  conservative: number
  libertarian: number
  autocratic: number
}

export interface ArticleWithDetails {
  id: string
  headline: string
  shortDescription: string
  content?: string | null
  sourceUrl: string
  imageUrl?: string | null
  authors?: string | null
  category: string
  publishedAt: Date
  createdAt: Date

  aiPredictedBias?: string | null
  aiBiasScore?: number | null
  aiConfidence?: number | null
  aiAnalysis?: string | null

  votesSocialist: number
  votesLiberal: number
  votesModerate: number
  votesConservative: number
  votesLibertarian: number
  votesAutocratic: number
  totalVotes: number
  communityBiasScore?: number | null

  readingTimeMinutes?: number | null
  wordCount?: number | null

  source?: {
    id: string
    name: string
    credibilityScore: number
    biasRating: number
  } | null

  entities?: {
    entity: {
      id: string
      name: string
      type: string
      politicalLean?: number | null
    }
    sentiment?: string | null
    mentions: number
  }[]

  communityNotes?: {
    id: string
    content: string
    status: string
    helpfulVotes: number
    notHelpfulVotes: number
    user: {
      name?: string | null
    }
    createdAt: Date
  }[]

  claims?: {
    id: string
    text: string
    verificationStatus: string
    factCheckUrl?: string | null
    factCheckSource?: string | null
  }[]

  userVote?: BiasLabel | null
}

export const BIAS_LABELS: { value: BiasLabel; label: string; color: string; description: string }[] = [
  {
    value: 'SOCIALIST',
    label: 'Socialist',
    color: '#DC2626',
    description: 'Far-left ideology emphasizing collective ownership'
  },
  {
    value: 'LIBERAL',
    label: 'Liberal',
    color: '#2563EB',
    description: 'Center-left supporting social progress and government programs'
  },
  {
    value: 'MODERATE',
    label: 'Moderate',
    color: '#8B5CF6',
    description: 'Centrist position balancing different viewpoints'
  },
  {
    value: 'CONSERVATIVE',
    label: 'Conservative',
    color: '#EF4444',
    description: 'Center-right emphasizing tradition and limited government'
  },
  {
    value: 'LIBERTARIAN',
    label: 'Libertarian',
    color: '#F59E0B',
    description: 'Emphasizing individual liberty and minimal government'
  },
  {
    value: 'AUTOCRATIC',
    label: 'Autocratic',
    color: '#1F2937',
    description: 'Far-right authoritarian ideology'
  },
]

export const ENTITY_COLORS: Record<EntityType, string> = {
  POLITICIAN: '#3B82F6',
  PARTY: '#10B981',
  STATE: '#F59E0B',
  ORGANIZATION: '#8B5CF6',
}
