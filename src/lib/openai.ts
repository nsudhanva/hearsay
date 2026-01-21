import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface BiasAnalysisResult {
  predictedBias: string
  biasScore: number // -100 to 100
  confidence: number // 0-100
  analysis: string
  entities: {
    name: string
    type: 'POLITICIAN' | 'PARTY' | 'STATE' | 'ORGANIZATION'
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  }[]
  claims: {
    text: string
    verifiable: boolean
  }[]
}

export async function analyzeArticleBias(
  headline: string,
  description: string,
  content?: string
): Promise<BiasAnalysisResult> {
  const articleText = content || description

  const prompt = `Analyze the following news article for political bias.

Headline: ${headline}

Content: ${articleText}

Respond in JSON format with the following structure:
{
  "predictedBias": "SOCIALIST" | "LIBERAL" | "MODERATE" | "CONSERVATIVE" | "LIBERTARIAN" | "AUTOCRATIC",
  "biasScore": <number from -100 (far left) to 100 (far right)>,
  "confidence": <number from 0 to 100 indicating confidence in the prediction>,
  "analysis": "<brief explanation of why this bias was detected>",
  "entities": [
    {
      "name": "<name of politician, party, state, or organization mentioned>",
      "type": "POLITICIAN" | "PARTY" | "STATE" | "ORGANIZATION",
      "sentiment": "POSITIVE" | "NEGATIVE" | "NEUTRAL"
    }
  ],
  "claims": [
    {
      "text": "<a specific factual claim from the article>",
      "verifiable": <boolean indicating if this claim can be fact-checked>
    }
  ]
}

Political spectrum guide:
- SOCIALIST (-100 to -75): Far-left, advocates for collective ownership, radical redistribution
- LIBERAL (-75 to -25): Center-left, supports social programs, progressive policies
- MODERATE (-25 to 25): Centrist, balanced views, pragmatic approach
- CONSERVATIVE (25 to 60): Center-right, traditional values, limited government
- LIBERTARIAN (60 to 85): Right-leaning, individual liberty, minimal government
- AUTOCRATIC (85 to 100): Far-right, authoritarian tendencies

Be objective and focus on the language, framing, and tone of the article rather than the topic itself.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a political bias analyst. Analyze news articles objectively and identify political leanings based on language, framing, and tone. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')

    return {
      predictedBias: result.predictedBias || 'MODERATE',
      biasScore: result.biasScore || 0,
      confidence: result.confidence || 50,
      analysis: result.analysis || 'Unable to determine bias.',
      entities: result.entities || [],
      claims: result.claims || [],
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    return {
      predictedBias: 'MODERATE',
      biasScore: 0,
      confidence: 0,
      analysis: 'Unable to analyze at this time.',
      entities: [],
      claims: [],
    }
  }
}

export async function generateArticleSummary(
  headline: string,
  content: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a news summarizer. Create concise, neutral summaries of news articles.',
        },
        {
          role: 'user',
          content: `Summarize this article in 2-3 sentences:\n\nHeadline: ${headline}\n\nContent: ${content}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
    })

    return response.choices[0].message.content || ''
  } catch (error) {
    console.error('OpenAI API error:', error)
    return ''
  }
}
