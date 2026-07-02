'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, Home } from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui'
import { logger } from '@/lib/logger'

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Structured logging (ready for Sentry integration later)
    logger.error('Project page error', {
      message: error.message,
      digest: error.digest,
      context: 'projects/[slug]',
    })
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-zavala-accent-error/10 border-2 border-zavala-accent-error/20">
            <AlertCircle className="w-16 h-16 text-zavala-accent-error" />
          </div>
        </div>

        {/* Error Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-zavala-text-primary mb-4">
          Failed to Load Project
        </h1>

        {/* Error Message */}
        <p className="text-lg text-zavala-text-secondary mb-8 leading-relaxed">
          We couldn&apos;t load this project. It might not exist or there was a problem fetching the
          data.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-6 bg-zavala-bg-surface border border-zavala-border rounded-lg text-left">
            <h2 className="text-sm font-mono font-semibold text-zavala-text-secondary mb-2">
              Error Details (Dev Mode):
            </h2>
            <code className="text-sm font-mono text-zavala-accent-error block whitespace-pre-wrap break-words">
              {error.message}
            </code>
            {error.digest && (
              <p className="text-xs font-mono text-zavala-text-tertiary mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button variant="primary" size="md" onClick={reset} className="w-full sm:w-auto">
            Try Again
          </Button>
          <ButtonLink href="/projects" variant="secondary" size="md" className="w-full sm:w-auto">
            <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
            All Projects
          </ButtonLink>
        </div>

        {/* Go Home Link */}
        <Link
          href="/"
          className="inline-flex items-center text-zavala-text-tertiary hover:text-zavala-accent-primary transition-colors text-sm"
        >
          <Home className="w-4 h-4 mr-2" />
          Return to Homepage
        </Link>
      </div>
    </div>
  )
}
