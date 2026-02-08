'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface FormData {
  name: string
  email: string
  message: string
  website: string // Honeypot field - should remain empty
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    website: '', // Honeypot field
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '', website: '' })
        setErrors({})
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zavala-text-secondary mb-2">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`
            w-full px-4 py-3 bg-zavala-bg-surface 
            border ${errors.name ? 'border-zavala-accent-error' : 'border-zavala-border'}
            rounded-lg text-zavala-text-primary placeholder:text-zavala-text-tertiary
            transition-all duration-200 focus:outline-none 
            focus:border-zavala-accent-primary focus:ring-2 focus:ring-zavala-accent-primary/20
            hover:border-zavala-border-strong disabled:opacity-50 disabled:cursor-not-allowed
          `}
          placeholder="Your name"
          disabled={isSubmitting}
        />
        {errors.name && (
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-zavala-accent-error mt-1">
            {errors.name}
          </motion.p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zavala-text-secondary mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`
            w-full px-4 py-3 bg-zavala-bg-surface 
            border ${errors.email ? 'border-zavala-accent-error' : 'border-zavala-border'}
            rounded-lg text-zavala-text-primary placeholder:text-zavala-text-tertiary
            transition-all duration-200 focus:outline-none 
            focus:border-zavala-accent-primary focus:ring-2 focus:ring-zavala-accent-primary/20
            hover:border-zavala-border-strong disabled:opacity-50 disabled:cursor-not-allowed
          `}
          placeholder="your.email@example.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-zavala-accent-error mt-1">
            {errors.email}
          </motion.p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-zavala-text-secondary mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          className={`
            w-full px-4 py-3 bg-zavala-bg-surface 
            border ${errors.message ? 'border-zavala-accent-error' : 'border-zavala-border'}
            rounded-lg text-zavala-text-primary placeholder:text-zavala-text-tertiary
            transition-all duration-200 focus:outline-none 
            focus:border-zavala-accent-primary focus:ring-2 focus:ring-zavala-accent-primary/20
            hover:border-zavala-border-strong disabled:opacity-50 disabled:cursor-not-allowed resize-none
          `}
          placeholder="Tell me about your project or idea..."
          disabled={isSubmitting}
        />
        {errors.message && (
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-zavala-accent-error mt-1">
            {errors.message}
          </motion.p>
        )}
      </div>

      {/* Honeypot field - hidden from users, visible to bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">
          Website (leave blank)
        </label>
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="
          w-full px-6 py-3 bg-zavala-accent-primary text-white font-semibold rounded-lg 
          transition-all duration-200 hover:bg-blue-600 hover:shadow-lg hover:shadow-zavala-accent-primary/20
          hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 
          focus:ring-zavala-accent-primary focus:ring-offset-2 focus:ring-offset-zavala-bg-primary
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
        "
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </button>

      {submitStatus === 'success' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-zavala-accent-secondary/10 border border-zavala-accent-secondary/30 rounded-lg">
          <p className="text-zavala-accent-secondary font-medium">
            ✓ Message sent successfully! I&apos;ll get back to you soon.
          </p>
        </motion.div>
      )}

      {submitStatus === 'error' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-zavala-accent-error/10 border border-zavala-accent-error/30 rounded-lg">
          <p className="text-zavala-accent-error font-medium">
            ✗ Something went wrong. Please try again or email me directly.
          </p>
        </motion.div>
      )}
    </form>
  )
}
