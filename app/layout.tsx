import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import { VariantProvider } from '@/components/variants/VariantProvider'
import { VariantSwitcher } from '@/components/variants/VariantSwitcher'
import { VariantEffects } from '@/components/variants/VariantEffects'
import { VARIANT_INIT_SCRIPT } from '@/lib/variants'
import { getPersonSchema, getWebSiteSchema, serializeJsonLd } from '@/lib/schema'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/site'

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | Maximiliano Zavala',
  },
  description: SITE_DESCRIPTION,
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
  authors: [{ name: SITE_NAME, url: SITE_URL }],
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
  // og:image and twitter:image are injected automatically from
  // app/opengraph-image.tsx (Next.js file convention) — no manual image URLs.
  // Canonicals are set per page, NOT here: a root-layout canonical would be
  // inherited by every page that doesn't override it, telling search engines
  // all pages are duplicates of the homepage.
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getPersonSchema(SITE_URL)
  const websiteJsonLd = getWebSiteSchema(SITE_URL)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        {/* Apply the persisted design variant before first paint (no flash).
            Same pre-hydration pattern next-themes uses for the theme class. */}
        <script dangerouslySetInnerHTML={{ __html: VARIANT_INIT_SCRIPT }} />
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
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd) }}
        />
        <ThemeProvider>
          <VariantProvider>
            <VariantEffects />
            <Navbar />
            <main id="main-content" className="min-h-screen pt-16">
              {children}
            </main>
            <Footer />
            <VariantSwitcher />
          </VariantProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
