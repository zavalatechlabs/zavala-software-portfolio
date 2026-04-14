import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { contactFormSchema, ContactFormData, isHoneypotTriggered } from '@/lib/validation'
import { contactRateLimiter } from '@/lib/rate-limit'
import { sendContactEmail } from '@/lib/email'
import { getEnv } from '@/lib/env'
import { logger } from '@/lib/logger'

/** Contact Form API Route - Handles validation, rate limiting, honeypot, and email sending */

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return 'unknown'
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const clientIp = getClientIp(request)

  try {
    logger.info('Contact API request received', { clientIp })

    // Rate limiting check (awaited — Upstash path is async, in-memory resolves immediately)
    if (await contactRateLimiter.isRateLimited(clientIp)) {
      logger.warn('Rate limit exceeded', { clientIp })
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests',
          code: 'rate_limited',
          retryAfter: '1 hour',
        },
        { status: 429 }
      )
    }

    // Validate request body
    let body: ContactFormData
    try {
      body = contactFormSchema.parse(await request.json())
    } catch (error) {
      logger.warn('Validation error', {
        error: error instanceof Error ? error.message : 'Unknown validation error',
      })
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            success: false,
            message: 'Validation failed',
            code: 'validation_error',
            details: error.issues.map((issue) => ({
              field: issue.path.join('.'),
              message: issue.message,
            })),
          },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { success: false, message: 'Validation failed', code: 'validation_error' },
        { status: 400 }
      )
    }

    // Honeypot check - return fake success if triggered
    if (isHoneypotTriggered(body)) {
      logger.warn('Honeypot triggered', { clientIp })
      return NextResponse.json(
        { success: true, message: 'Message sent successfully!' },
        { status: 200 }
      )
    }

    // Send email — recipient and sender come from validated env vars
    const { CONTACT_EMAIL, FROM_EMAIL } = getEnv()
    const emailResult = await sendContactEmail(body, {
      from: FROM_EMAIL,
      to: CONTACT_EMAIL,
      clientIp,
    })

    if (!emailResult.success) {
      logger.error('Failed to send email', { error: emailResult.error })
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to send message. Please try again later.',
          code: 'server_error',
        },
        { status: 500 }
      )
    }

    const duration = Date.now() - startTime
    logger.info('Request completed successfully', { durationMs: duration })

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    )
  } catch (error) {
    const duration = Date.now() - startTime
    logger.error('Unexpected error', {
      durationMs: duration,
      error: error instanceof Error ? error.message : 'Unknown error',
    })

    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred', code: 'server_error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' }, { status: 200 })
}
