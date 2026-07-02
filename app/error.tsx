'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui'
import { logger } from '@/lib/logger'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Root error boundary caught', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    })
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-zavala-accent-error/10 border-2 border-zavala-accent-error/20">
            <AlertTriangle className="w-16 h-16 text-zavala-accent-error" />
          </div>
        </div>

        {/* Error Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-zavala-text-primary mb-4">
          Something went wrong
        </h1>

        {/* Error Message */}
        <p className="text-lg text-zavala-text-secondary mb-8 leading-relaxed">
          We encountered an unexpected error. This has been logged and we&apos;ll look into it.
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
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="primary" size="md" onClick={reset} className="w-full sm:w-auto">
            <RefreshCcw className="w-5 h-5 mr-2" aria-hidden="true" />
            Try Again
          </Button>
          <ButtonLink href="/" variant="secondary" size="md" className="w-full sm:w-auto">
            <Home className="w-5 h-5 mr-2" aria-hidden="true" />
            Go Home
          </ButtonLink>
        </div>

        {/* Additional Help Text */}
        <p className="text-sm text-zavala-text-tertiary mt-8">
          If this problem persists, please{' '}
          <Link href="/contact" className="text-zavala-accent-primary hover:underline">
            contact me
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
