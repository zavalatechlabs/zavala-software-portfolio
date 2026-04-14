import { Resend } from 'resend'
import { getEnv } from './env'
import { ContactFormData, sanitizeHtml } from './validation'
import { logger } from './logger'

const RESEND_TIMEOUT_MS = 10_000 // 10 seconds

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Email service timeout')), ms)
    ),
  ])
}

/**
 * Strip CRLF and null bytes to prevent email header injection.
 * @param str - User-supplied string destined for an email header
 * @returns Sanitized string safe for use in email headers
 */
export function sanitizeForHeader(str: string): string {
  return str.replace(/[\r\n\0\u2028\u2029]/g, '')
}

/**
 * Email sending result
 */
export interface EmailResult {
  success: boolean
  emailId?: string
  error?: string
}

/**
 * Email configuration
 */
export interface EmailConfig {
  from: string
  to: string
  clientIp?: string
}

/**
 * Send contact form email via Resend
 * @param data - Validated contact form data
 * @param config - Email configuration (from, to, clientIp)
 * @returns Promise with email result
 */
export async function sendContactEmail(
  data: ContactFormData,
  config: EmailConfig
): Promise<EmailResult> {
  try {
    // Env is validated lazily on first access — not at import time — so
    // static page generation can import this module without env vars.
    const resendApiKey = getEnv().RESEND_API_KEY

    // Check if using test key (for development)
    const isTestKey = resendApiKey.startsWith('re_test_')

    if (isTestKey) {
      logger.info('Using test API key - email will not be sent')
    }

    const resend = new Resend(resendApiKey)

    // Sanitize inputs for email content
    const sanitizedName = sanitizeHtml(data.name)
    const sanitizedEmail = sanitizeHtml(data.email)
    const sanitizedMessage = sanitizeHtml(data.message)

    // Build email HTML
    const emailHtml = buildEmailHtml({
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
      clientIp: config.clientIp,
      timestamp: new Date().toISOString(),
    })

    // Send email via Resend (with timeout to prevent serverless hangs)
    const emailResponse = await withTimeout(
      resend.emails.send({
        from: config.from,
        to: config.to,
        reply_to: sanitizeForHeader(data.email),
        subject: `New Contact Form Submission from ${sanitizeForHeader(data.name)}`,
        html: emailHtml,
      }),
      RESEND_TIMEOUT_MS
    )

    logger.info('Email sent successfully', {
      emailId: emailResponse.data?.id,
      name: data.name,
      email: data.email,
    })

    return {
      success: true,
      emailId: emailResponse.data?.id,
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Email service timeout') {
      logger.error('Resend API timeout', { timeoutMs: RESEND_TIMEOUT_MS })
    } else {
      logger.error('Failed to send email', {
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
    return {
      success: false,
      error: 'Failed to send message',
    }
  }
}

/**
 * Build HTML email template
 * @param data - Email template data
 * @returns HTML string
 */
function buildEmailHtml(data: {
  name: string
  email: string
  message: string
  clientIp?: string
  timestamp: string
}): string {
  return `
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
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${data.email}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          <div class="footer">
            <p>Sent from Portfolio Contact Form</p>
            ${data.clientIp ? `<p>IP Address: ${data.clientIp}</p>` : ''}
            <p>Timestamp: ${data.timestamp}</p>
          </div>
        </div>
      </body>
    </html>
  `
}
