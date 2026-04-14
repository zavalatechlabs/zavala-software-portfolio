// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Provide dummy server env vars so lib/env.ts passes Zod validation when
// test files call getEnv(). Individual tests can still mock or override.
process.env.RESEND_API_KEY = process.env.RESEND_API_KEY || 're_test_jest_dummy'
process.env.CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'test@example.com'
process.env.FROM_EMAIL = process.env.FROM_EMAIL || 'Test <onboarding@resend.dev>'

// Polyfill for TextEncoder/TextDecoder (needed for Resend/React Email)
import { TextEncoder, TextDecoder } from 'util'

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder
}
