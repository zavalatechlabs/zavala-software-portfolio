'use client'

import { useState, useRef } from 'react'
import { Button, Input, Label, Textarea } from '@/components/ui'
import { validateContactField } from '@/lib/contact-form'

interface ContactFormState {
  name: string
  email: string
  message: string
  website: string // Honeypot field - should remain empty
}

interface ContactFormFieldErrors {
  name?: string
  email?: string
  message?: string
}

type SubmitStatus = 'idle' | 'success' | 'error'

const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again or email me directly.'
const RATE_LIMIT_MESSAGE =
  'Too many messages in a short time. Please wait a bit before trying again.'

interface ContactApiResponse {
  success?: boolean
  code?: string
  details?: Array<{ field: string; message: string }>
}

export function ContactForm() {
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState<ContactFormState>({
    name: '',
    email: '',
    message: '',
    website: '', // Honeypot field
  })
  const [errors, setErrors] = useState<ContactFormFieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [submitError, setSubmitError] = useState(GENERIC_ERROR_MESSAGE)

  const validateForm = (): boolean => {
    const newErrors: ContactFormFieldErrors = {}

    const nameError = validateContactField('name', formData.name)
    if (nameError) newErrors.name = nameError

    const emailError = validateContactField('email', formData.email)
    if (emailError) newErrors.email = emailError

    const messageError = validateContactField('message', formData.message)
    if (messageError) newErrors.message = messageError

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name) nameRef.current?.focus()
      else if (newErrors.email) emailRef.current?.focus()
      else if (newErrors.message) messageRef.current?.focus()
    }

    return Object.keys(newErrors).length === 0
  }

  /** Map the API's structured validation details onto field errors. */
  const applyServerFieldErrors = (details: ContactApiResponse['details']): boolean => {
    if (!details || details.length === 0) return false
    const fieldErrors: ContactFormFieldErrors = {}
    for (const detail of details) {
      if (detail.field === 'name' || detail.field === 'email' || detail.field === 'message') {
        fieldErrors[detail.field] = detail.message
      }
    }
    if (Object.keys(fieldErrors).length === 0) return false
    setErrors(fieldErrors)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      let data: ContactApiResponse = {}
      try {
        data = (await response.json()) as ContactApiResponse
      } catch {
        // Non-JSON response (e.g. a proxy error page) — fall through to the
        // generic error below.
      }

      if (response.ok && data.success) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '', website: '' })
        setErrors({})
        // Focus the success message after render
        setTimeout(() => successRef.current?.focus(), 0)
      } else if (response.status === 429) {
        setSubmitError(RATE_LIMIT_MESSAGE)
        setSubmitStatus('error')
      } else if (data.code === 'validation_error' && applyServerFieldErrors(data.details)) {
        // Field-level messages are shown inline; no banner needed.
        setSubmitStatus('idle')
      } else {
        setSubmitError(GENERIC_ERROR_MESSAGE)
        setSubmitStatus('error')
      }
    } catch {
      // Network failure — fetch itself rejected.
      setSubmitError(GENERIC_ERROR_MESSAGE)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof ContactFormFieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <Label htmlFor="name" required>
          Name
        </Label>
        <Input
          ref={nameRef}
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          aria-required="true"
          autoComplete="name"
          placeholder="Your name"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input
          ref={emailRef}
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          aria-required="true"
          autoComplete="email"
          placeholder="your.email@example.com"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="message" required>
          Message
        </Label>
        <Textarea
          ref={messageRef}
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          error={errors.message}
          aria-required="true"
          placeholder="Tell me about your project or idea..."
          disabled={isSubmitting}
        />
      </div>

      {/* Honeypot field - hidden from users, visible to bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website (leave blank)</label>
        <input
          type="text"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="w-full disabled:hover:transform-none"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </Button>

      {submitStatus === 'success' && (
        <div
          ref={successRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="p-4 bg-zavala-accent-secondary/10 border border-zavala-accent-secondary/30 rounded-lg animate-fade-in-up"
        >
          <p className="text-zavala-accent-secondary font-medium">
            ✓ Message sent successfully! I&apos;ll get back to you soon.
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div
          role="alert"
          className="p-4 bg-zavala-accent-error/10 border border-zavala-accent-error/30 rounded-lg animate-fade-in-up"
        >
          <p className="text-zavala-accent-error font-medium">✗ {submitError}</p>
        </div>
      )}
    </form>
  )
}
