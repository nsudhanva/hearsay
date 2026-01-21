import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/header'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Hearsay - Transparent News Bias Detection',
  description:
    'Crowdsourced political bias detection for news articles. See how AI and the community rate news bias on the political spectrum.',
  keywords: [
    'news',
    'bias detection',
    'political bias',
    'fact checking',
    'crowdsourcing',
    'AI',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Header />
            <main>{children}</main>
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              className:
                'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800',
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
