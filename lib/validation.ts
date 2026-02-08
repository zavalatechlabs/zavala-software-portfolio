import { z } from 'zod'

/**
 * Contact Form Validation Schema
 * 
 * Validates contact form submissions with:
 * - Name: 1-100 characters, trimmed
 * - Email: Valid email format, lowercase, max 255 chars
 * - Message: 10-5000 characters, trimmed
 * - Website: Honeypot field (should be empty)
 */
export const contactFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z.string()
    .trim()
    .toLowerCase()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters')
    .trim(),
  // Honeypot field - should be empty (bots typically fill all fields)
  website: z.string().optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

/**
 * Check if honeypot was triggered
 * @param data - Validated contact form data
 * @returns true if honeypot triggered (likely bot), false otherwise
 */
export function isHoneypotTriggered(data: ContactFormData): boolean {
  return !!(data.website && data.website.trim() !== '')
}

/**
 * Sanitize HTML to prevent XSS in email content
 * @param text - User input text
 * @returns Sanitized text with HTML entities encoded
 */
export function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}
