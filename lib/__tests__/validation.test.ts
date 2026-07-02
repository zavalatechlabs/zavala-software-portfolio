import { describe, it, expect } from '@jest/globals'
import { contactFormSchema, isHoneypotTriggered, sanitizeHtml } from '../validation'

describe('contactFormSchema', () => {
  it('should validate valid contact form data', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a valid message with enough characters.',
      website: '',
    }

    const result = contactFormSchema.parse(validData)
    expect(result).toBeDefined()
    expect(result.name).toBe('John Doe')
    expect(result.email).toBe('john@example.com')
  })

  it('should trim and lowercase email', () => {
    const data = {
      name: 'John Doe',
      email: '  JOHN@EXAMPLE.COM  ',
      message: 'Valid message here',
    }

    const result = contactFormSchema.parse(data)
    expect(result.email).toBe('john@example.com')
  })

  it('should reject empty name', () => {
    const invalidData = {
      name: '',
      email: 'john@example.com',
      message: 'Valid message',
    }

    expect(() => contactFormSchema.parse(invalidData)).toThrow()
  })

  it('should reject invalid email format', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'not-an-email',
      message: 'Valid message',
    }

    expect(() => contactFormSchema.parse(invalidData)).toThrow()
  })

  it('should reject message too short', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Short',
    }

    expect(() => contactFormSchema.parse(invalidData)).toThrow()
  })

  it('should reject name longer than 100 characters', () => {
    const invalidData = {
      name: 'A'.repeat(101),
      email: 'john@example.com',
      message: 'Valid message here',
    }

    expect(() => contactFormSchema.parse(invalidData)).toThrow()
  })

  it('should reject message longer than 5000 characters', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'A'.repeat(5001),
    }

    expect(() => contactFormSchema.parse(invalidData)).toThrow()
  })

  it('should allow optional website field', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Valid message',
    }

    const result = contactFormSchema.parse(data)
    expect(result.website).toBeUndefined()
  })

  it('should reject name with CRLF characters', () => {
    const data = {
      name: 'John\r\nBcc: evil@attacker.com',
      email: 'john@example.com',
      message: 'Valid message here',
    }
    expect(() => contactFormSchema.parse(data)).toThrow()
  })

  it('should reject email with CRLF injection', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com\r\nBcc: evil@attacker.com',
      message: 'Valid message here',
    }
    expect(() => contactFormSchema.parse(data)).toThrow()
  })

  it('should reject name with unicode line separators', () => {
    const data = {
      name: 'John\u2028Doe',
      email: 'john@example.com',
      message: 'Valid message here',
    }
    expect(() => contactFormSchema.parse(data)).toThrow()
  })

  it('should reject email with null byte', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com\0',
      message: 'Valid message here',
    }
    expect(() => contactFormSchema.parse(data)).toThrow()
  })

  // .trim() runs BEFORE .min(), so whitespace-only values must fail
  it('should reject whitespace-only name', () => {
    const data = {
      name: '   ',
      email: 'john@example.com',
      message: 'Valid message here',
    }
    expect(() => contactFormSchema.parse(data)).toThrow()
  })

  it('should reject whitespace-only message', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      message: '          ',
    }
    expect(() => contactFormSchema.parse(data)).toThrow()
  })

  it('should reject message that is too short after trimming', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      message: '   hi   ',
    }
    expect(() => contactFormSchema.parse(data)).toThrow()
  })
})

describe('isHoneypotTriggered', () => {
  it('should return false for empty website field', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Valid message',
      website: '',
    }

    expect(isHoneypotTriggered(data)).toBe(false)
  })

  it('should return false for undefined website field', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Valid message',
    }

    expect(isHoneypotTriggered(data)).toBe(false)
  })

  it('should return true for filled website field', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Valid message',
      website: 'https://spam.com',
    }

    expect(isHoneypotTriggered(data)).toBe(true)
  })

  it('should return false for whitespace-only website field', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Valid message',
      website: '   ',
    }

    expect(isHoneypotTriggered(data)).toBe(false)
  })
})

describe('sanitizeHtml', () => {
  it('should escape HTML entities', () => {
    const input = '<script>alert("XSS")</script>'
    const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;'
    expect(sanitizeHtml(input)).toBe(expected)
  })

  it('should escape ampersands', () => {
    expect(sanitizeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry')
  })

  it('should escape quotes', () => {
    expect(sanitizeHtml(`"Hello" and 'world'`)).toBe('&quot;Hello&quot; and &#x27;world&#x27;')
  })

  it('should escape all dangerous characters', () => {
    const input = `<div class="test" onclick='alert("hi")'>Test & More</div>`
    const result = sanitizeHtml(input)
    expect(result).not.toContain('<')
    expect(result).not.toContain('>')
    expect(result).not.toContain('"')
    expect(result).not.toContain("'")
  })

  it('should handle empty string', () => {
    expect(sanitizeHtml('')).toBe('')
  })

  it('should handle string with no special characters', () => {
    const input = 'Hello World 123'
    expect(sanitizeHtml(input)).toBe(input)
  })
})
