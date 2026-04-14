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
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[^\r\n\0\u2028\u2029]*$/, 'Name must not contain control characters')
    .trim(),
  email: z
    .string()
    .trim()
    .regex(/^[^\r\n\0\u2028\u2029]*$/, 'Email must not contain control characters')
    .toLowerCase()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters')
    .regex(/^[^\0\u2028\u2029]*$/, 'Message must not contain control characters')
    .trim(),
  // Honeypot field - should be empty (bots typically fill all fields)
  website: z.string().optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

/**
 * Validate a single contact form field using the shared Zod schema.
 * Returns the first error message for the field, or null if valid.
 * Safe to use in 'use client' components.
 */
export function validateContactField(
  field: 'name' | 'email' | 'message',
  value: string
): string | null {
  // Build a partial object with defaults so other fields don't cause errors
  const defaults: Record<string, string> = {
    name: 'placeholder',
    email: 'placeholder@example.com',
    message: 'placeholder text that is long enough',
  }
  const testData = { ...defaults, [field]: value }

  const result = contactFormSchema.safeParse(testData)
  if (result.success) return null

  const fieldError = result.error.issues.find((issue) => issue.path[0] === field)
  return fieldError ? fieldError.message : null
}

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
