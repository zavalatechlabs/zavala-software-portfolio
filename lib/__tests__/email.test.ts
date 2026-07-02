// Controllable Resend mock: each test decides what emails.send resolves to.
const mockSend = jest.fn()
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: mockSend,
    },
  })),
}))

import { sendContactEmail, sanitizeForHeader } from '../email'
import { ContactFormData } from '../validation'

describe('sendContactEmail', () => {
  const mockContactData: ContactFormData = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'This is a test message',
  }

  const mockConfig = {
    from: 'Test <test@example.com>',
    to: 'recipient@example.com',
    clientIp: '192.168.1.1',
  }

  // RESEND_API_KEY is validated lazily via getEnv() and injected by
  // jest.setup.js as a dummy test key.

  beforeEach(() => {
    mockSend.mockReset()
  })

  it('returns success with the email id when Resend accepts the send', async () => {
    mockSend.mockResolvedValue({ data: { id: 'email-123' }, error: null })

    const result = await sendContactEmail(mockContactData, mockConfig)

    expect(result.success).toBe(true)
    expect(result.emailId).toBe('email-123')
  })

  it('returns failure when Resend resolves with an API error (SDK does not throw)', async () => {
    mockSend.mockResolvedValue({
      data: null,
      error: { name: 'validation_error', message: 'Domain is not verified' },
    })

    const result = await sendContactEmail(mockContactData, mockConfig)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Failed to send message')
  })

  it('returns failure when the Resend call rejects', async () => {
    mockSend.mockRejectedValue(new Error('network down'))

    const result = await sendContactEmail(mockContactData, mockConfig)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Failed to send message')
  })

  it('returns failure when Resend hangs past the timeout', async () => {
    jest.useFakeTimers()
    mockSend.mockImplementation(() => new Promise(() => {})) // never resolves

    const resultPromise = sendContactEmail(mockContactData, mockConfig)
    await jest.advanceTimersByTimeAsync(10_001)
    const result = await resultPromise

    expect(result.success).toBe(false)
    expect(result.error).toBe('Failed to send message')
    jest.useRealTimers()
  })

  it('sanitizes the submitter name in the subject header', async () => {
    mockSend.mockResolvedValue({ data: { id: 'email-123' }, error: null })

    await sendContactEmail(
      { ...mockContactData, name: 'Evil\r\nBcc: victim@example.com' },
      mockConfig
    )

    const sentPayload = mockSend.mock.calls[0]?.[0]
    expect(sentPayload.subject).not.toContain('\r')
    expect(sentPayload.subject).not.toContain('\n')
  })

  it('uses the submitter email as reply_to (sanitized)', async () => {
    mockSend.mockResolvedValue({ data: { id: 'email-123' }, error: null })

    await sendContactEmail(mockContactData, mockConfig)

    const sentPayload = mockSend.mock.calls[0]?.[0]
    expect(sentPayload.reply_to).toBe('john@example.com')
    expect(sentPayload.from).toBe(mockConfig.from)
    expect(sentPayload.to).toBe(mockConfig.to)
  })

  it('escapes HTML in the email body', async () => {
    mockSend.mockResolvedValue({ data: { id: 'email-123' }, error: null })

    await sendContactEmail(
      { ...mockContactData, message: '<script>alert("xss")</script> long enough' },
      mockConfig
    )

    const sentPayload = mockSend.mock.calls[0]?.[0]
    expect(sentPayload.html).not.toContain('<script>')
    expect(sentPayload.html).toContain('&lt;script&gt;')
  })

  it('handles config without clientIp', async () => {
    mockSend.mockResolvedValue({ data: { id: 'email-123' }, error: null })

    const result = await sendContactEmail(mockContactData, {
      from: 'Test <test@example.com>',
      to: 'recipient@example.com',
    })

    expect(result.success).toBe(true)
  })
})

describe('sanitizeForHeader', () => {
  it('strips CR, LF, null bytes, and unicode line separators', () => {
    expect(sanitizeForHeader('a\rb\nc\0d e f')).toBe('abcdef')
  })

  it('leaves normal strings untouched', () => {
    expect(sanitizeForHeader('John Doe')).toBe('John Doe')
  })
})
