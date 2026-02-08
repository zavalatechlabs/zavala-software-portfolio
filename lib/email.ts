import { Resend } from 'resend'
import { ContactFormData, sanitizeHtml } from './validation'

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
    // Get API key from environment
    const resendApiKey = process.env.RESEND_API_KEY
    
    if (!resendApiKey) {
      // eslint-disable-next-line no-console
      console.error('[Email] RESEND_API_KEY not configured')
      return {
        success: false,
        error: 'Email service not configured'
      }
    }
    
    // Check if using test key (for development)
    const isTestKey = resendApiKey.startsWith('re_test_')
    
    if (isTestKey) {
      // eslint-disable-next-line no-console
      console.log('[Email] Using test API key - email will not be sent')
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
      timestamp: new Date().toISOString()
    })
    
    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: config.from,
      to: config.to,
      reply_to: data.email,
      subject: `New Contact Form Submission from ${data.name}`,
      html: emailHtml,
    })
    
    // eslint-disable-next-line no-console
    console.log('[Email] Email sent successfully', {
      emailId: emailResponse.data?.id,
      name: data.name,
      email: data.email,
    })
    
    return {
      success: true,
      emailId: emailResponse.data?.id
    }
    
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Email] Failed to send email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
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
