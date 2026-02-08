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

export const metadata: Metadata = {
  title: {
    default: 'Zavala Software Portfolio',
    template: '%s | Zavala Software',
  },
  description: 'Modern developer portfolio showcasing projects, skills, and experience',
  keywords: ['portfolio', 'software development', 'web development', 'Next.js', 'TypeScript'],
  authors: [{ name: 'Zavala Software' }],
  creator: 'Zavala Software',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zavalatechlabs.com',
    title: 'Zavala Software Portfolio',
    description: 'Modern developer portfolio showcasing projects, skills, and experience',
    siteName: 'Zavala Software',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zavala Software Portfolio',
    description: 'Modern developer portfolio showcasing projects, skills, and experience',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
