import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { contactFormSchema, ContactFormData, isHoneypotTriggered } from '@/lib/validation'
import { contactRateLimiter } from '@/lib/rate-limit'
import { sendContactEmail } from '@/lib/email'

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
    // eslint-disable-next-line no-console
    console.log(`[Contact API] Request from IP: ${clientIp}`)
    
    // Rate limiting check
    if (contactRateLimiter.isRateLimited(clientIp)) {
      // eslint-disable-next-line no-console
      console.warn(`[Contact API] Rate limit exceeded for IP: ${clientIp}`)
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.', retryAfter: '1 hour' },
        { status: 429 }
      )
    }
    
    // Validate request body
    let body: ContactFormData
    try {
      body = contactFormSchema.parse(await request.json())
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`[Contact API] Validation error:`, error)
      if (error instanceof z.ZodError) {
        return NextResponse.json({ 
          error: 'Invalid form data',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        }, { status: 400 })
      }
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 })
    }
    
    // Honeypot check - return fake success if triggered
    if (isHoneypotTriggered(body)) {
      // eslint-disable-next-line no-console
      console.warn(`[Contact API] Honeypot triggered for IP: ${clientIp}`)
      return NextResponse.json(
        { success: true, message: 'Form submitted successfully' },
        { status: 200 }
      )
    }
    
    // Send email
    const emailResult = await sendContactEmail(body, {
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'zavala.techlabs@gmail.com',
      clientIp
    })
    
    if (!emailResult.success) {
      // eslint-disable-next-line no-console
      console.error('[Contact API] Failed to send email:', emailResult.error)
      return NextResponse.json(
        { error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      )
    }
    
    const duration = Date.now() - startTime
    // eslint-disable-next-line no-console
    console.log(`[Contact API] Request completed successfully in ${duration}ms`)
    
    return NextResponse.json(
      { success: true, message: 'Thank you for your message! I\'ll get back to you soon.' },
      { status: 200 }
    )
    
  } catch (error) {
    const duration = Date.now() - startTime
    // eslint-disable-next-line no-console
    console.error(`[Contact API] Unexpected error after ${duration}ms:`, error)
    
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'Contact Form API',
    version: '1.0.0',
    methods: ['POST']
  })
}
