/**
 * Client-safe contact form field limits, messages, and per-field validation.
 *
 * This module deliberately has no dependencies (no Zod) so it can be imported
 * from 'use client' components without pulling the Zod bundle into the client.
 * The server-side Zod schema in `lib/validation.ts` imports these same
 * constants, so limits and messages stay in sync — the server schema remains
 * the source of truth for what is accepted.
 */

export const NAME_MAX_LENGTH = 100
export const EMAIL_MAX_LENGTH = 255
export const MESSAGE_MIN_LENGTH = 10
export const MESSAGE_MAX_LENGTH = 5000

/** Characters never allowed in single-line fields (header-injection guard). */
export const CONTROL_CHARS = /[\r\n\0\u2028\u2029]/

/** Null bytes and Unicode line separators are not allowed anywhere. */
export const MESSAGE_CONTROL_CHARS = /[\0\u2028\u2029]/

export const CONTACT_MESSAGES = {
  nameRequired: 'Name is required',
  nameTooLong: `Name must be less than ${NAME_MAX_LENGTH} characters`,
  nameControlChars: 'Name must not contain control characters',
  emailInvalid: 'Invalid email address',
  emailTooLong: `Email must be less than ${EMAIL_MAX_LENGTH} characters`,
  emailControlChars: 'Email must not contain control characters',
  messageTooShort: `Message must be at least ${MESSAGE_MIN_LENGTH} characters`,
  messageTooLong: `Message must be less than ${MESSAGE_MAX_LENGTH} characters`,
  messageControlChars: 'Message must not contain control characters',
} as const

/**
 * Intentionally permissive email shape check for client-side UX.
 * The server-side Zod schema performs the authoritative validation.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validate a single contact form field for inline client-side feedback.
 * Returns the first error message for the field, or null if valid.
 * Mirrors the server-side Zod schema in `lib/validation.ts`.
 */
export function validateContactField(
  field: 'name' | 'email' | 'message',
  value: string
): string | null {
  switch (field) {
    case 'name': {
      const trimmed = value.trim()
      if (trimmed.length === 0) return CONTACT_MESSAGES.nameRequired
      if (trimmed.length > NAME_MAX_LENGTH) return CONTACT_MESSAGES.nameTooLong
      if (CONTROL_CHARS.test(value)) return CONTACT_MESSAGES.nameControlChars
      return null
    }
    case 'email': {
      const trimmed = value.trim()
      if (CONTROL_CHARS.test(trimmed)) return CONTACT_MESSAGES.emailControlChars
      if (!EMAIL_PATTERN.test(trimmed)) return CONTACT_MESSAGES.emailInvalid
      if (trimmed.length > EMAIL_MAX_LENGTH) return CONTACT_MESSAGES.emailTooLong
      return null
    }
    case 'message': {
      const trimmed = value.trim()
      if (trimmed.length < MESSAGE_MIN_LENGTH) return CONTACT_MESSAGES.messageTooShort
      if (trimmed.length > MESSAGE_MAX_LENGTH) return CONTACT_MESSAGES.messageTooLong
      if (MESSAGE_CONTROL_CHARS.test(value)) return CONTACT_MESSAGES.messageControlChars
      return null
    }
  }
}
