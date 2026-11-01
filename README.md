# Hearsay - Transparent News Bias Detection Platform

A modern, AI-powered platform for detecting and crowdsourcing political bias in news articles. Inspired by Twitter/X's Community Notes feature, Hearsay combines OpenAI's GPT models with community voting to create a transparent news ecosystem.

## Overview

Hearsay aims to increase media literacy by making political bias visible and transparent. Users can:
- See AI-predicted political bias for news articles
- Vote on perceived bias using a political spectrum
- Add community notes to provide context
- View analytics on bias distribution across sources
- Track credibility scores for news outlets

---

## How To Use The App

New to Hearsay? Here's how to get the most out of the platform:

```mermaid
flowchart TD
    subgraph Step1["Step 1: Browse Articles"]
        A1[Visit the home feed]
        A2[See AI-detected bias badges on each article]
        A3[Filter by bias type or search keywords]
    end

    subgraph Step2["Step 2: Read & Evaluate"]
        B1[Click an article to read details]
        B2[View the political spectrum visualization]
        B3[Check entity mentions and claims]
    end

    subgraph Step3["Step 3: Contribute"]
        C1[Sign in with your account]
        C2[Vote on where you think the bias falls]
        C3[Add community notes for context]
    end

    subgraph Step4["Step 4: Explore"]
        D1[Visit Analytics for platform trends]
        D2[Check Sources for outlet credibility]
        D3[Use Spectrum view to compare articles]
    end

    Step1 --> Step2 --> Step3 --> Step4
```

### Quick Start Guide

| Action | How To |
|--------|--------|
| **View articles** | Browse the home feed - each card shows headline, AI bias, and vote count |
| **Filter by bias** | Click any bias label (Socialist, Liberal, etc.) to filter articles |
| **Read full article** | Click "Read More" on any card to see full details |
| **Vote on bias** | Click "Vote" button, then select where you think the article falls on the spectrum |
| **Add context** | Scroll to "Community Notes" section, sign in, and add helpful context |
| **Run AI analysis** | On article detail page, click "Analyze with AI" to get bias prediction |

---

## User Journey

```mermaid
journey
    title User Journey: Evaluating News Bias
    section Discovery
      Land on Hearsay: 5: User
      Browse news feed: 4: User
      Notice bias badges: 4: User
    section Engagement
      Click article to read: 5: User
      View bias spectrum: 4: User
      Check community notes: 4: User
    section Participation
      Create account: 3: User
      Cast first vote: 5: User
      Add community note: 4: User
    section Insight
      View analytics dashboard: 4: User
      Compare sources: 4: User
      Share findings: 5: User
```

---

## Architecture

```mermaid
flowchart TB
    subgraph Client["Frontend (Next.js)"]
        UI[React Components]
        Store[Zustand Store]
        Query[TanStack Query]
    end

    subgraph Server["Backend (Next.js API Routes)"]
        Articles["/api/articles"]
        Votes["/api/articles/[id]/vote"]
        Notes["/api/articles/[id]/notes"]
        Analyze["/api/articles/[id]/analyze"]
        Auth["/api/auth/*"]
        Analytics["/api/analytics"]
    end

    subgraph AI["AI Services"]
        OpenAI[OpenAI GPT-4o-mini]
    end

    subgraph DB["Database"]
        Prisma[Prisma ORM]
        SQLite[(SQLite DB)]
    end

    UI --> Query
    Query --> Articles
    Query --> Votes
    Query --> Notes
    Query --> Analytics
    Store --> UI

    Articles --> Prisma
    Votes --> Prisma
    Notes --> Prisma
    Analytics --> Prisma
    Auth --> Prisma
    Analyze --> OpenAI
    Analyze --> Prisma

    Prisma --> SQLite
```

---

## Political Spectrum

Hearsay uses a 6-point political spectrum for bias classification. The spectrum flows from **Blue (Left)** to **Gray (Center)** to **Red (Right)**:

```mermaid
graph LR
    subgraph Spectrum["Political Spectrum (-100 to +100)"]
        S["Socialist<br/>Far Left"]
        L["Liberal<br/>Left"]
        M["Moderate<br/>Center"]
        C["Conservative<br/>Right"]
        LB["Libertarian<br/>Far Right"]
        A["Autocratic<br/>Auth Right"]
    end

    S --> L --> M --> C --> LB --> A

    style S fill:#4338CA,color:#fff
    style L fill:#2563EB,color:#fff
    style M fill:#64748B,color:#fff
    style C fill:#DC2626,color:#fff
    style LB fill:#EA580C,color:#fff
    style A fill:#7F1D1D,color:#fff
```

| Label | Score Range | Color | Description |
|-------|-------------|-------|-------------|
| Socialist | -100 to -75 | Indigo | Far-left ideology emphasizing collective ownership |
| Liberal | -75 to -25 | Blue | Center-left supporting social progress and government programs |
| Moderate | -25 to +25 | Gray | Centrist position balancing different viewpoints |
| Conservative | +25 to +60 | Red | Center-right emphasizing tradition and limited government |
| Libertarian | +60 to +85 | Orange | Emphasizing individual liberty and minimal government |
| Autocratic | +85 to +100 | Dark Red | Far-right authoritarian ideology |

---

## Data Flow

### Article Analysis Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant AI as OpenAI
    participant DB as Database

    U->>F: View article
    F->>A: GET /api/articles/[id]
    A->>DB: Fetch article
    DB-->>A: Article data
    A-->>F: Article + bias data
    F-->>U: Display article

    U->>F: Click "Analyze with AI"
    F->>A: POST /api/articles/[id]/analyze
    A->>AI: Send headline + content
    AI-->>A: Bias prediction + entities + claims
    A->>DB: Update article with AI analysis
    A->>DB: Create/update entities
    A->>DB: Create claims
    DB-->>A: Success
    A-->>F: Analysis result
    F-->>U: Display bias + entities
```

### Voting Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant DB as Database

    U->>F: Select bias label
    F->>A: POST /api/articles/[id]/vote
    A->>DB: Check existing vote

    alt Has existing vote
        A->>DB: Update vote + adjust counts
    else No existing vote
        A->>DB: Create vote + increment counts
    end

    A->>DB: Recalculate community bias score
    DB-->>A: Success
    A-->>F: Vote recorded
    F-->>U: Update UI with new counts
```

### Community Notes Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant DB as Database

    U->>F: Submit community note
    F->>A: POST /api/articles/[id]/notes
    A->>DB: Create note (status: PENDING)
    DB-->>A: Note created
    A-->>F: Success
    F-->>U: "Note submitted for review"

    Note over U,DB: Other users vote on note helpfulness

    U->>F: Vote helpful/not helpful
    F->>A: POST /api/notes/[id]/vote
    A->>DB: Update vote counts

    alt 5+ votes & 70%+ helpful
        A->>DB: Set status: APPROVED
    else 5+ votes & 30%- helpful
        A->>DB: Set status: REJECTED
    end

    DB-->>A: Success
    A-->>F: Vote recorded
```

---

## Database Schema

```mermaid
erDiagram
    User ||--o{ Vote : creates
    User ||--o{ CommunityNote : writes
    User ||--o{ NoteVote : casts
    User ||--o{ Session : has

    Article ||--o{ Vote : receives
    Article ||--o{ CommunityNote : has
    Article ||--o{ ArticleEntity : mentions
    Article ||--o{ Claim : contains
    Article }o--|| Source : from

    Entity ||--o{ ArticleEntity : mentioned_in

    CommunityNote ||--o{ NoteVote : receives

    User {
        string id PK
        string email UK
        string name
        string passwordHash
        datetime createdAt
    }

    Article {
        string id PK
        string headline
        string shortDescription
        string content
        string sourceUrl UK
        string imageUrl
        string authors
        string category
        datetime publishedAt
        string aiPredictedBias
        float aiBiasScore
        float aiConfidence
        string aiAnalysis
        int votesSocialist
        int votesLiberal
        int votesModerate
        int votesConservative
        int votesLibertarian
        int votesAutocratic
        int totalVotes
        float communityBiasScore
    }

    Vote {
        string id PK
        string biasLabel
        datetime createdAt
        string userId FK
        string articleId FK
    }

    CommunityNote {
        string id PK
        string content
        string status
        int helpfulVotes
        int notHelpfulVotes
        string userId FK
        string articleId FK
    }

    Entity {
        string id PK
        string name UK
        string type
        float politicalLean
    }

    Source {
        string id PK
        string name UK
        float credibilityScore
        float biasRating
        int articleCount
    }

    Claim {
        string id PK
        string text
        string verificationStatus
        string factCheckUrl
        string articleId FK
    }
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Database** | SQLite (via Prisma) |
| **ORM** | Prisma 5 |
| **AI** | OpenAI GPT-4o-mini |
| **State Management** | Zustand |
| **Data Fetching** | TanStack Query |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Auth** | Custom (bcrypt) |
| **Notifications** | React Hot Toast |
| **Containerization** | Docker + Traefik |

---

## Features

### Core Features
- **News Feed**: Browse political news articles with bias indicators
- **AI Bias Analysis**: OpenAI-powered political bias detection
- **Community Voting**: Crowdsourced bias classification
- **Political Spectrum Visualization**: Interactive bias spectrum display
- **Community Notes**: Twitter/X-style context additions
- **Entity Extraction**: Automatic detection of politicians, parties, states, organizations
- **Claim Detection**: Identification of verifiable claims

### Analytics & Insights
- **Platform Analytics**: Overall bias distribution charts
- **Source Credibility Scores**: Track reliability of news outlets
- **Vote Distribution**: See how the community rates each article
- **Trend Analysis**: Bias patterns over time

### User Features
- **User Authentication**: Register/login system
- **Personal Voting History**: Track your voting patterns
- **Dark Mode**: Full dark theme support
- **Responsive Design**: Works on mobile, tablet, desktop

---

## Getting Started

### Option 1: Local Development

#### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key

#### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hearsay.git
   cd hearsay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

4. **Initialize the database**
   ```bash
   # Run migrations
   npx prisma migrate dev

   # Seed with sample data
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

### Option 2: Docker Compose (Recommended for Production)

Run Hearsay with Traefik reverse proxy for a production-like setup:

#### Prerequisites
- Docker & Docker Compose
- OpenAI API key

#### Quick Start with Docker

1. **Clone and set up environment**
   ```bash
   git clone https://github.com/yourusername/hearsay.git
   cd hearsay

   # Create .env file
   echo "OPENAI_API_KEY=your-openai-api-key" > .env
   ```

2. **Start the containers**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - **Hearsay App**: [http://hearsay.localhost](http://hearsay.localhost)
   - **Traefik Dashboard**: [http://traefik.localhost](http://traefik.localhost) or [http://localhost:8080](http://localhost:8080)

4. **Seed the database** (first time only)
   ```bash
   docker-compose exec hearsay npx prisma db seed
   ```

#### Docker Architecture

```mermaid
flowchart LR
    subgraph Docker["Docker Compose"]
        T[Traefik:80/8080]
        H[Hearsay:3000]
        V[(Volume: hearsay-data)]
    end

    Browser -->|hearsay.localhost| T
    T -->|Route| H
    H -->|SQLite| V

    style T fill:#00ADD8,color:#fff
    style H fill:#000,color:#fff
```

#### Docker Commands

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start all services |
| `docker-compose down` | Stop all services |
| `docker-compose logs -f hearsay` | View app logs |
| `docker-compose exec hearsay sh` | Shell into container |
| `docker-compose build --no-cache` | Rebuild images |

---

### Demo Account

Use the pre-seeded demo account to test:
- **Email**: demo@hearsay.ai
- **Password**: demo123

---

## Project Structure

```
hearsay/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Sample data seeder
│   └── migrations/        # Database migrations
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── api/           # API routes
│   │   │   ├── articles/  # Article CRUD & voting
│   │   │   ├── auth/      # Authentication
│   │   │   ├── analytics/ # Platform analytics
│   │   │   ├── notes/     # Community notes voting
│   │   │   └── sources/   # News sources
│   │   ├── article/       # Article detail page
│   │   ├── analytics/     # Analytics dashboard
│   │   ├── login/         # Auth pages
│   │   ├── sources/       # Source credibility page
│   │   ├── spectrum/      # Spectrum visualization
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home/feed page
│   ├── components/
│   │   ├── article/       # Article-related components
│   │   ├── layout/        # Layout components (header)
│   │   └── ui/            # Reusable UI components
│   ├── lib/
│   │   ├── openai.ts      # OpenAI API integration
│   │   ├── prisma.ts      # Prisma client
│   │   └── utils.ts       # Utility functions
│   ├── store/
│   │   └── index.ts       # Zustand store
│   └── types/
│       └── index.ts       # TypeScript types
├── Dockerfile             # Container build
├── docker-compose.yml     # Multi-container setup
├── .env                   # Environment variables
├── package.json
└── README.md
```

---

## API Reference

### Articles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | List articles (with pagination, filters) |
| POST | `/api/articles` | Create new article |
| GET | `/api/articles/[id]` | Get article details |
| POST | `/api/articles/[id]/vote` | Vote on article bias |
| POST | `/api/articles/[id]/analyze` | Run AI bias analysis |
| GET | `/api/articles/[id]/notes` | Get community notes |
| POST | `/api/articles/[id]/notes` | Add community note |

### Query Parameters for GET /api/articles

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |
| `category` | string | Filter by category |
| `bias` | string | Filter by AI bias prediction |
| `source` | string | Filter by source ID |
| `search` | string | Search in headline/description |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Platform statistics |
| GET | `/api/sources` | List news sources |
| POST | `/api/notes/[id]/vote` | Vote on community note |

---

## AI Integration

Hearsay uses OpenAI's GPT-4o-mini model for:

1. **Bias Classification**: Predicts political lean on 6-point scale
2. **Confidence Scoring**: 0-100% confidence in prediction
3. **Analysis Explanation**: Natural language explanation of detected bias
4. **Entity Extraction**: Identifies politicians, parties, states, organizations
5. **Claim Detection**: Extracts verifiable factual claims

### Sample AI Response

```json
{
  "predictedBias": "LIBERAL",
  "biasScore": -45,
  "confidence": 78,
  "analysis": "The article uses language favorable to environmental regulations...",
  "entities": [
    { "name": "Joe Biden", "type": "POLITICIAN", "sentiment": "POSITIVE" },
    { "name": "Democratic Party", "type": "PARTY", "sentiment": "POSITIVE" }
  ],
  "claims": [
    { "text": "Carbon emissions dropped 15% last year", "verifiable": true }
  ]
}
```

---

## Component Architecture

```mermaid
flowchart TB
    subgraph Pages["Pages"]
        Home["/"]
        Article["/article/[id]"]
        Spectrum["/spectrum"]
        Analytics["/analytics"]
        Sources["/sources"]
        Login["/login"]
    end

    subgraph Layout["Layout Components"]
        Header[Header]
        Providers[Providers]
    end

    subgraph Article_Components["Article Components"]
        ArticleCard[ArticleCard]
        VotingPanel[VotingPanel]
        CommunityNote[CommunityNote]
    end

    subgraph UI_Components["UI Components"]
        Button[Button]
        Card[Card]
        Badge[Badge]
        BiasSpectrum[BiasSpectrum]
        Modal[Modal]
        Input[Input]
        Tooltip[Tooltip]
    end

    Home --> ArticleCard
    Article --> VotingPanel
    Article --> CommunityNote
    ArticleCard --> Badge
    ArticleCard --> BiasSpectrum
    ArticleCard --> Button
    VotingPanel --> Button
    VotingPanel --> BiasSpectrum

    Header --> Button
    Analytics --> Card
    Sources --> Card
```

---

## User Flow

```mermaid
flowchart TD
    Start([User visits site]) --> Browse[Browse News Feed]
    Browse --> Filter{Apply Filters?}
    Filter -->|Yes| Search[Search/Filter Articles]
    Search --> Browse
    Filter -->|No| View[View Article]

    View --> Analyze{Analyzed?}
    Analyze -->|No| AI[Run AI Analysis]
    AI --> View
    Analyze -->|Yes| Vote{Want to Vote?}

    Vote -->|Yes| Auth{Logged In?}
    Auth -->|No| Login[Login/Register]
    Login --> Vote
    Auth -->|Yes| Cast[Cast Bias Vote]
    Cast --> Note{Add Note?}

    Vote -->|No| Note
    Note -->|Yes| WriteNote[Write Community Note]
    WriteNote --> Browse
    Note -->|No| Analytics[View Analytics]
    Analytics --> Browse
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run seed` | Seed database with sample data |
| `npm run db:push` | Push schema changes to DB |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:reset` | Reset DB and re-seed |

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite connection string | Yes |
| `OPENAI_API_KEY` | OpenAI API key for bias analysis | Yes |
| `NEXTAUTH_SECRET` | Secret for session encryption | Yes |
| `NEXTAUTH_URL` | Base URL of the application | Yes |

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Database not found** | Run `npx prisma migrate dev` then `npm run seed` |
| **AI analysis fails** | Check your `OPENAI_API_KEY` in `.env` |
| **Can't login** | Ensure database is seeded: `npm run seed` |
| **Docker: hearsay.localhost not working** | Add `127.0.0.1 hearsay.localhost` to `/etc/hosts` |
| **Port 80 in use** | Stop other services or change port in `docker-compose.yml` |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Future Enhancements

- [ ] Real-time news aggregation from RSS feeds
- [ ] Browser extension for bias detection on any page
- [ ] Multi-language support
- [ ] User reputation system
- [ ] Fact-check API integrations (Snopes, PolitiFact)
- [ ] Social sharing with bias context
- [ ] Email digest of bias trends
- [ ] Export voting data for research
- [ ] Mobile app (React Native)
- [ ] Webhook notifications

---

## Inspiration

This project was inspired by:
- **Twitter/X Community Notes**: Crowdsourced context on tweets
- **AllSides Media Bias Ratings**: Media bias classification
- **Ground News**: Multi-source news coverage comparison
- The original Hearsay academic project by Ananth Narasimhan & Sudhanva Narayana

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Authors

- **Sudhanva Narayana** - [GitHub](https://github.com/nsudhanva)
- **Ananth Narasimhan** - Original concept co-author

---

Built with Next.js, OpenAI, and community power.
