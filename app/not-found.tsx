'use client'

import Link from 'next/link'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Icon */}
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-zavala-accent-primary/10 border-2 border-zavala-accent-primary/20">
            <FileQuestion className="w-16 h-16 text-zavala-accent-primary" />
          </div>
        </div>

        {/* 404 Heading */}
        <div className="mb-6">
          <h1 className="text-8xl md:text-9xl font-bold text-zavala-text-primary mb-2 font-mono">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-zavala-text-primary">
            Page Not Found
          </h2>
        </div>

        {/* Description */}
        <p className="text-lg text-zavala-text-secondary mb-12 leading-relaxed max-w-lg mx-auto">
          Looks like you&apos;ve ventured into uncharted territory. The page you&apos;re looking for
          doesn&apos;t exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="p-6 bg-zavala-bg-surface border border-zavala-border-default rounded-lg">
          <h3 className="text-sm font-semibold text-zavala-text-secondary mb-4 uppercase tracking-wide">
            You might be looking for:
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/projects"
              className="px-4 py-2 bg-zavala-bg-elevated hover:bg-zavala-bg-primary border border-zavala-border-subtle rounded-lg text-zavala-text-primary text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zavala-accent-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zavala-bg-primary"
            >
              Projects
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 bg-zavala-bg-elevated hover:bg-zavala-bg-primary border border-zavala-border-subtle rounded-lg text-zavala-text-primary text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zavala-accent-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zavala-bg-primary"
            >
              About Me
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 bg-zavala-bg-elevated hover:bg-zavala-bg-primary border border-zavala-border-subtle rounded-lg text-zavala-text-primary text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zavala-accent-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zavala-bg-primary"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
