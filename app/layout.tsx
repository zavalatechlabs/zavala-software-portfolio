import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import { getPersonSchema, getWebSiteSchema } from '@/lib/schema'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
})

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zavalatechlabs.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Maximiliano Zavala - Full-Stack Developer & Software Engineer',
    template: '%s | Maximiliano Zavala',
  },
  description:
    'Full-stack developer specializing in Next.js, TypeScript, and React. Building modern web applications with clean code and exceptional user experiences.',
  keywords: [
    'Maximiliano Zavala',
    'full-stack developer',
    'software engineer',
    'Next.js developer',
    'TypeScript',
    'React',
    'web development',
    'portfolio',
    'frontend development',
    'backend development',
  ],
  authors: [{ name: 'Maximiliano Zavala', url: baseUrl }],
  creator: 'Maximiliano Zavala',
  publisher: 'Maximiliano Zavala',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    title: 'Maximiliano Zavala - Full-Stack Developer & Software Engineer',
    description:
      'Full-stack developer specializing in Next.js, TypeScript, and React. Building modern web applications with clean code and exceptional user experiences.',
    siteName: 'Maximiliano Zavala',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Maximiliano Zavala - Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maximiliano Zavala - Full-Stack Developer & Software Engineer',
    description:
      'Full-stack developer specializing in Next.js, TypeScript, and React. Building modern web applications with clean code and exceptional user experiences.',
    images: ['/opengraph-image.png'],
  },
  alternates: {
    canonical: baseUrl,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getPersonSchema(baseUrl)
  const websiteJsonLd = getWebSiteSchema(baseUrl)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-zavala-bg-primary focus:text-zavala-text-primary focus:rounded"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ThemeProvider>
          <Navbar />
          <main id="main-content" className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
