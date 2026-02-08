import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

/**
 * Contact Form API Route
 * 
 * Features:
 * - Email validation with Zod
 * - Rate limiting (5 requests per IP per hour)
 * - Honeypot spam detection
 * - Resend email integration
 * - Comprehensive error handling
 * - Request logging
 * 
 * Security:
 * - Input sanitization via Zod
 * - Rate limiting prevents abuse
 * - Honeypot catches bots
 * - No internal error leakage
 */

// Zod schema for request validation
const ContactFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .trim()
    .toLowerCase(),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters')
    .trim(),
  // Honeypot field - should be empty (bots typically fill all fields)
  website: z.string().optional(),
})

type ContactFormData = z.infer<typeof ContactFormSchema>

// Simple in-memory rate limiter
// Key: IP address, Value: array of timestamps
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5

/**
 * Check if the IP address has exceeded rate limits
 * @param ip - Client IP address
 * @returns true if rate limited, false otherwise
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const requests = rateLimitMap.get(ip) || []
  
  // Remove timestamps older than the window
  const recentRequests = requests.filter(timestamp => 
    now - timestamp < RATE_LIMIT_WINDOW_MS
  )
  
  // Update the map with cleaned requests
  rateLimitMap.set(ip, recentRequests)
  
  // Check if limit exceeded
  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    console.warn(`Rate limit exceeded for IP: ${ip}`)
    return true
  }
  
  // Add current timestamp
  recentRequests.push(now)
  rateLimitMap.set(ip, recentRequests)
  
  return false
}

/**
 * Get client IP address from request
 * @param request - Next.js request object
 * @returns IP address string
 */
function getClientIp(request: NextRequest): string {
  // Try various headers in order of preference
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }
  
  // Fallback to a default (should not happen in production)
  return 'unknown'
}

/**
 * Sanitize HTML to prevent XSS in email content
 * @param text - User input text
 * @returns Sanitized text
 */
function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const clientIp = getClientIp(request)
  
  try {
    // Log incoming request
    console.log(`[Contact API] Request from IP: ${clientIp}`)
    
    // Rate limiting check
    if (isRateLimited(clientIp)) {
      console.warn(`[Contact API] Rate limit exceeded for IP: ${clientIp}`)
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: '1 hour'
        },
        { status: 429 }
      )
    }
    
    // Parse and validate request body
    let body: ContactFormData
    try {
      const rawBody = await request.json()
      body = ContactFormSchema.parse(rawBody)
    } catch (error) {
      console.warn(`[Contact API] Validation error:`, error)
      
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Invalid form data',
            details: error.issues.map((issue) => ({
              field: issue.path.join('.'),
              message: issue.message
            }))
          },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      )
    }
    
    // Honeypot check - if 'website' field is filled, it's likely a bot
    if (body.website && body.website.trim() !== '') {
      console.warn(`[Contact API] Honeypot triggered for IP: ${clientIp}`)
      // Return success to avoid revealing the honeypot
      return NextResponse.json(
        { 
          success: true,
          message: 'Form submitted successfully' 
        },
        { status: 200 }
      )
    }
    
    // Initialize Resend client
    const resendApiKey = process.env.RESEND_API_KEY
    
    if (!resendApiKey) {
      console.error('[Contact API] RESEND_API_KEY not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }
    
    // Check if using test key (for development)
    const isTestKey = resendApiKey.startsWith('re_test_')
    
    if (isTestKey) {
      console.log('[Contact API] Using test API key - email will not be sent')
    }
    
    const resend = new Resend(resendApiKey)
    
    // Sanitize inputs for email content
    const sanitizedName = sanitizeHtml(body.name)
    const sanitizedEmail = sanitizeHtml(body.email)
    const sanitizedMessage = sanitizeHtml(body.message)
    
    // Send email via Resend
    try {
      const emailResponse = await resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: 'zavala.techlabs@gmail.com',
        reply_to: body.email,
        subject: `New Contact Form Submission from ${body.name}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
                .content { background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #555; }
                .value { margin-top: 5px; }
                .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2 style="margin: 0;">New Contact Form Submission</h2>
                </div>
                <div class="content">
                  <div class="field">
                    <div class="label">Name:</div>
                    <div class="value">${sanitizedName}</div>
                  </div>
                  <div class="field">
                    <div class="label">Email:</div>
                    <div class="value">${sanitizedEmail}</div>
                  </div>
                  <div class="field">
                    <div class="label">Message:</div>
                    <div class="value">${sanitizedMessage.replace(/\n/g, '<br>')}</div>
                  </div>
                </div>
                <div class="footer">
                  <p>Sent from Portfolio Contact Form</p>
                  <p>IP Address: ${clientIp}</p>
                  <p>Timestamp: ${new Date().toISOString()}</p>
                </div>
              </div>
            </body>
          </html>
        `,
      })
      
      const duration = Date.now() - startTime
      console.log(`[Contact API] Email sent successfully in ${duration}ms`, {
        emailId: emailResponse.data?.id,
        name: body.name,
        email: body.email,
        ip: clientIp
      })
      
      return NextResponse.json(
        { 
          success: true,
          message: 'Thank you for your message! I\'ll get back to you soon.' 
        },
        { status: 200 }
      )
      
    } catch (emailError) {
      console.error('[Contact API] Failed to send email:', emailError)
      
      // Don't leak internal error details to client
      return NextResponse.json(
        { error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      )
    }
    
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[Contact API] Unexpected error after ${duration}ms:`, error)
    
    // Generic error response (don't leak internal details)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}

/**
 * GET handler - return API information
 */
export async function GET() {
  return NextResponse.json({
    name: 'Contact Form API',
    version: '1.0.0',
    methods: ['POST'],
    rateLimit: {
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS,
    }
  })
}
