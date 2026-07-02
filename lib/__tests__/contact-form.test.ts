import { describe, it, expect } from '@jest/globals'
import {
  CONTACT_MESSAGES,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  validateContactField,
} from '../contact-form'

describe('validateContactField', () => {
  describe('name', () => {
    it('returns null for a valid name', () => {
      expect(validateContactField('name', 'John Doe')).toBeNull()
    })

    it('returns the required error for an empty name', () => {
      expect(validateContactField('name', '')).toBe(CONTACT_MESSAGES.nameRequired)
    })

    it('returns the required error for a whitespace-only name', () => {
      expect(validateContactField('name', '   ')).toBe(CONTACT_MESSAGES.nameRequired)
    })

    it('returns the length error for an overlong name', () => {
      expect(validateContactField('name', 'A'.repeat(NAME_MAX_LENGTH + 1))).toBe(
        CONTACT_MESSAGES.nameTooLong
      )
    })

    it('rejects control characters (header-injection guard)', () => {
      expect(validateContactField('name', 'John\r\nBcc: evil@attacker.com')).toBe(
        CONTACT_MESSAGES.nameControlChars
      )
    })
  })

  describe('email', () => {
    it('returns null for a valid email', () => {
      expect(validateContactField('email', 'john@example.com')).toBeNull()
    })

    it('returns the invalid error for a malformed email', () => {
      expect(validateContactField('email', 'not-an-email')).toBe(CONTACT_MESSAGES.emailInvalid)
    })

    it('returns the invalid error for an empty email', () => {
      expect(validateContactField('email', '')).toBe(CONTACT_MESSAGES.emailInvalid)
    })

    it('rejects CRLF injection attempts', () => {
      expect(validateContactField('email', 'a@b.com\r\nBcc: evil@attacker.com')).toBe(
        CONTACT_MESSAGES.emailControlChars
      )
    })
  })

  describe('message', () => {
    it('returns null for a valid message', () => {
      expect(validateContactField('message', 'This is a valid message.')).toBeNull()
    })

    it('returns the too-short error for a short message', () => {
      expect(validateContactField('message', 'Short')).toBe(CONTACT_MESSAGES.messageTooShort)
    })

    it('returns the too-short error for a whitespace-padded short message', () => {
      expect(validateContactField('message', '   hi     ')).toBe(CONTACT_MESSAGES.messageTooShort)
    })

    it('returns the too-long error past the max length', () => {
      expect(validateContactField('message', 'A'.repeat(MESSAGE_MAX_LENGTH + 1))).toBe(
        CONTACT_MESSAGES.messageTooLong
      )
    })

    it('allows newlines (multi-line messages are legitimate)', () => {
      expect(validateContactField('message', 'Line one.\nLine two is long enough.')).toBeNull()
    })

    it('rejects null bytes', () => {
      expect(validateContactField('message', 'A perfectly fine message\0with a null byte')).toBe(
        CONTACT_MESSAGES.messageControlChars
      )
    })
  })

  it('mirrors the server-side Zod schema for the shared cases', async () => {
    // Guard against drift between the client validator and the Zod schema:
    // every case the client rejects, the server must reject, and vice versa
    // for these representative inputs.
    const { contactFormSchema } = await import('../validation')
    const cases = [
      { name: 'John', email: 'john@example.com', message: 'A valid message here.' },
      { name: '', email: 'john@example.com', message: 'A valid message here.' },
      { name: '   ', email: 'john@example.com', message: 'A valid message here.' },
      { name: 'John', email: 'nope', message: 'A valid message here.' },
      { name: 'John', email: 'john@example.com', message: 'short' },
      { name: 'A'.repeat(101), email: 'john@example.com', message: 'A valid message here.' },
    ]

    for (const data of cases) {
      const clientValid =
        validateContactField('name', data.name) === null &&
        validateContactField('email', data.email) === null &&
        validateContactField('message', data.message) === null
      const serverValid = contactFormSchema.safeParse(data).success
      expect(clientValid).toBe(serverValid)
    }
  })
})
