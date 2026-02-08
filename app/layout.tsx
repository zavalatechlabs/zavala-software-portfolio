import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'

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
  description: 'Full-stack developer specializing in Next.js, TypeScript, and React. Building modern web applications with clean code and exceptional user experiences.',
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
    description: 'Full-stack developer specializing in Next.js, TypeScript, and React. Building modern web applications with clean code and exceptional user experiences.',
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
    description: 'Full-stack developer specializing in Next.js, TypeScript, and React. Building modern web applications with clean code and exceptional user experiences.',
    images: ['/opengraph-image.png'],
  },
  alternates: {
    canonical: baseUrl,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Maximiliano Zavala',
    url: baseUrl,
    jobTitle: 'Full-Stack Developer',
    description: 'Full-stack developer specializing in Next.js, TypeScript, and React',
    sameAs: [
      // Add social media URLs here when available
    ],
    knowsAbout: [
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Web Development',
      'Software Engineering',
    ],
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Maximiliano Zavala - Portfolio',
    url: baseUrl,
    description: 'Full-stack developer specializing in Next.js, TypeScript, and React',
    author: {
      '@type': 'Person',
      name: 'Maximiliano Zavala',
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
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
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
