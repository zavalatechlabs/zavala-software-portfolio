import { z } from 'zod'
import {
  CONTACT_MESSAGES,
  EMAIL_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  NAME_MAX_LENGTH,
} from './contact-form'

/**
 * Contact Form Validation Schema
 *
 * Server-side source of truth for contact form submissions:
 * - Name: 1-100 characters after trimming
 * - Email: Valid email format, lowercase, max 255 chars
 * - Message: 10-5000 characters after trimming
 * - Website: Honeypot field (should be empty)
 *
 * `.trim()` runs BEFORE the length checks so whitespace-only values are
 * rejected (a single space must not satisfy `min(1)`).
 *
 * Field limits and error messages are shared with the client-side validator
 * in `lib/contact-form.ts`.
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, CONTACT_MESSAGES.nameRequired)
    .max(NAME_MAX_LENGTH, CONTACT_MESSAGES.nameTooLong)
    .regex(/^[^\r\n\0\u2028\u2029]*$/, CONTACT_MESSAGES.nameControlChars),
  email: z
    .string()
    .trim()
    .regex(/^[^\r\n\0\u2028\u2029]*$/, CONTACT_MESSAGES.emailControlChars)
    .toLowerCase()
    .email(CONTACT_MESSAGES.emailInvalid)
    .max(EMAIL_MAX_LENGTH, CONTACT_MESSAGES.emailTooLong),
  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN_LENGTH, CONTACT_MESSAGES.messageTooShort)
    .max(MESSAGE_MAX_LENGTH, CONTACT_MESSAGES.messageTooLong)
    .regex(/^[^\0\u2028\u2029]*$/, CONTACT_MESSAGES.messageControlChars),
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
