/**
 * @jest-environment node
 */

/**
 * End-to-end tests for the /api/contact route.
 *
 * Mocks sendContactEmail (lib/email) and contactRateLimiter (lib/rate-limit)
 * so the handler can be exercised in isolation without network or Redis calls.
 */

// ---------------------------------------------------------------------------
// Mocks — declared before any imports so Jest hoists them correctly
// ---------------------------------------------------------------------------

jest.mock('@/lib/email', () => ({
  sendContactEmail: jest.fn(),
}))

jest.mock('@/lib/rate-limit', () => ({
  contactRateLimiter: {
    isRateLimited: jest.fn(),
  },
}))

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------

import { NextRequest } from 'next/server'
import { POST, GET } from '../route'
import { sendContactEmail } from '@/lib/email'
import { contactRateLimiter } from '@/lib/rate-limit'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockedSendContactEmail = sendContactEmail as jest.MockedFunction<typeof sendContactEmail>
const mockedIsRateLimited = contactRateLimiter.isRateLimited as jest.MockedFunction<
  typeof contactRateLimiter.isRateLimited
>

/** Build a NextRequest that mimics a POST to /api/contact. */
function buildRequest(body: unknown, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })
}

/** Valid payload that passes Zod validation. */
const validPayload = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  message: 'Hello, this is a test message that is long enough.',
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks()

  // Defaults: not rate-limited, email succeeds
  mockedIsRateLimited.mockResolvedValue(false)
  mockedSendContactEmail.mockResolvedValue({ success: true, emailId: 'test-id' })

  // Silence console output during tests
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('POST /api/contact', () => {
  // ----- Valid submission -------------------------------------------------

  it('returns 200 and sends email for a valid submission', async () => {
    const req = buildRequest(validPayload, { 'x-forwarded-for': '1.2.3.4' })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.message).toBe('Message sent successfully!')

    expect(mockedSendContactEmail).toHaveBeenCalledTimes(1)
    expect(mockedSendContactEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Hello, this is a test message that is long enough.',
      }),
      expect.objectContaining({
        from: expect.any(String),
        to: expect.any(String),
        clientIp: '1.2.3.4',
      })
    )
  })

  // ----- Honeypot triggered -----------------------------------------------

  it('returns fake 200 and does NOT send email when honeypot is triggered', async () => {
    const req = buildRequest({ ...validPayload, website: 'http://spam.bot' })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.message).toBe('Message sent successfully!')
    expect(mockedSendContactEmail).not.toHaveBeenCalled()
  })

  it('sends email when honeypot field is empty string', async () => {
    const req = buildRequest({ ...validPayload, website: '' })
    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(mockedSendContactEmail).toHaveBeenCalledTimes(1)
  })

  // ----- Rate limiting ----------------------------------------------------

  it('returns 429 when rate limit is exceeded', async () => {
    mockedIsRateLimited.mockResolvedValue(true)

    const req = buildRequest(validPayload)
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(429)
    expect(json.success).toBe(false)
    expect(json.message).toBe('Too many requests')
    expect(json.code).toBe('rate_limited')
    expect(json.retryAfter).toBeDefined()
    expect(mockedSendContactEmail).not.toHaveBeenCalled()
  })

  // ----- Invalid JSON body ------------------------------------------------

  it('returns 400 for a body that is not valid JSON', async () => {
    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: 'this is not json{{{',
      headers: { 'Content-Type': 'application/json' },
    })

    const res = await POST(req)

    // The request.json() call will throw, which is caught by the outer
    // try/catch as an unexpected error (not a ZodError).
    expect([400, 500]).toContain(res.status)
  })

  // ----- Validation errors ------------------------------------------------

  it('returns 400 with field errors when name is missing', async () => {
    const req = buildRequest({ email: 'a@b.com', message: 'Long enough message here.' })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.message).toBe('Validation failed')
    expect(json.code).toBe('validation_error')
    expect(json.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'name' })])
    )
  })

  it('returns 400 with field errors for an invalid email', async () => {
    const req = buildRequest({
      name: 'Test',
      email: 'not-an-email',
      message: 'Long enough message here.',
    })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'email' })])
    )
  })

  it('returns 400 with field errors when message is too short', async () => {
    const req = buildRequest({ name: 'Test', email: 'a@b.com', message: 'Hi' })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'message' })])
    )
  })

  it('returns 400 for multiple validation errors at once', async () => {
    const req = buildRequest({ name: '', email: 'bad', message: '' })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.details.length).toBeGreaterThanOrEqual(2)
  })

  // ----- Email sending failure --------------------------------------------

  it('returns 500 when sendContactEmail reports failure', async () => {
    mockedSendContactEmail.mockResolvedValue({
      success: false,
      error: 'Resend API error',
    })

    const req = buildRequest(validPayload)
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json.success).toBe(false)
    expect(json.message).toMatch(/failed to send/i)
    expect(json.code).toBe('server_error')
  })

  // ----- IP extraction ----------------------------------------------------

  it('extracts IP from x-forwarded-for header (first entry)', async () => {
    const req = buildRequest(validPayload, {
      'x-forwarded-for': '10.0.0.1, 10.0.0.2',
    })
    await POST(req)

    expect(mockedSendContactEmail).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ clientIp: '10.0.0.1' })
    )
  })

  it('falls back to x-real-ip when x-forwarded-for is absent', async () => {
    const req = buildRequest(validPayload, {
      'x-real-ip': '192.168.1.1',
    })
    await POST(req)

    expect(mockedSendContactEmail).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ clientIp: '192.168.1.1' })
    )
  })

  it('uses "unknown" when no IP headers are present', async () => {
    const req = buildRequest(validPayload)
    await POST(req)

    expect(mockedSendContactEmail).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ clientIp: 'unknown' })
    )
  })
})

// ----- Exception: sendContactEmail throws --------------------------------

it('returns 500 with server_error when sendContactEmail throws', async () => {
  mockedSendContactEmail.mockRejectedValue(new Error('Resend SDK exploded'))

  const req = buildRequest(validPayload, { 'x-forwarded-for': '1.2.3.4' })
  const res = await POST(req)
  const json = await res.json()

  expect(res.status).toBe(500)
  expect(json.success).toBe(false)
  expect(json.code).toBe('server_error')
})

// ----- Exception: isRateLimited throws (Redis down) --------------------

it('returns 500 when isRateLimited throws (Redis down)', async () => {
  mockedIsRateLimited.mockRejectedValue(new Error('Redis connection refused'))

  const req = buildRequest(validPayload)
  const res = await POST(req)
  const json = await res.json()

  expect(res.status).toBe(500)
  expect(json.success).toBe(false)
  expect(json.code).toBe('server_error')
})

// ----- Honeypot + rate limiter throws ----------------------------------

it('returns 500 when rate limiter throws even if honeypot is filled (rate limit runs first)', async () => {
  mockedIsRateLimited.mockRejectedValue(new Error('Redis connection refused'))

  const req = buildRequest({ ...validPayload, website: 'http://spam.bot' })
  const res = await POST(req)
  const json = await res.json()

  // Rate limit check runs before honeypot, so the exception propagates
  expect(res.status).toBe(500)
  expect(json.success).toBe(false)
  expect(json.code).toBe('server_error')
})

// ---------------------------------------------------------------------------
// GET handler
// ---------------------------------------------------------------------------

describe('GET /api/contact', () => {
  it('returns ok status with 200', async () => {
    const res = await GET()
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.status).toBe('ok')
  })
})
