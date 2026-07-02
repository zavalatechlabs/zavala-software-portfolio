import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '../ContactForm'

describe('ContactForm', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Rendering', () => {
    it('renders all form fields correctly', () => {
      render(<ContactForm />)

      // Check for labels
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument()

      // Check for inputs
      expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/your.email@example.com/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/tell me about your project/i)).toBeInTheDocument()

      // Check for submit button
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
    })

    it('renders honeypot field as hidden', () => {
      render(<ContactForm />)

      const honeypotDiv = screen.getByLabelText(/website \(leave blank\)/i).closest('div')
      expect(honeypotDiv).toHaveClass('hidden')
      expect(honeypotDiv).toHaveAttribute('aria-hidden', 'true')
    })

    it('has honeypot field with correct attributes', () => {
      render(<ContactForm />)

      const honeypotField = screen.getByLabelText(/website \(leave blank\)/i)
      expect(honeypotField).toHaveAttribute('tabIndex', '-1')
      expect(honeypotField).toHaveAttribute('autoComplete', 'off')
    })
  })

  describe('Validation', () => {
    it('shows error when name is empty', async () => {
      render(<ContactForm />)
      const submitButton = screen.getByRole('button', { name: /send message/i })

      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      })
    })

    it('accepts single-character name (server schema allows min 1)', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
      global.fetch = mockFetch

      render(<ContactForm />)
      const nameInput = screen.getByLabelText(/name/i)

      await userEvent.type(nameInput, 'A')
      await userEvent.type(screen.getByLabelText(/email/i), 'a@example.com')
      await userEvent.type(screen.getByLabelText(/message/i), 'This is a test message.')

      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
      })
      // No name error should appear
      expect(
        screen.queryByText(/name/i, { selector: '.text-zavala-accent-error' })
      ).not.toBeInTheDocument()
    })

    it('shows error when email is empty', async () => {
      render(<ContactForm />)
      const submitButton = screen.getByRole('button', { name: /send message/i })

      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
      })
    })

    it('shows error when email format is invalid', async () => {
      render(<ContactForm />)
      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const messageInput = screen.getByLabelText(/message/i)
      const form = screen.getByRole('button', { name: /send message/i }).closest('form')!

      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.change(messageInput, { target: { value: 'This is a test message.' } })

      fireEvent.submit(form)

      const errorMessage = await screen.findByText(/invalid email address/i)
      expect(errorMessage).toBeInTheDocument()
    })

    it('shows error when message is empty', async () => {
      render(<ContactForm />)
      const submitButton = screen.getByRole('button', { name: /send message/i })

      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument()
      })
    })

    it('shows error when message is too short', async () => {
      render(<ContactForm />)
      const messageInput = screen.getByLabelText(/message/i)
      const submitButton = screen.getByRole('button', { name: /send message/i })

      await userEvent.type(messageInput, 'Short')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument()
      })
    })

    it('clears error when user starts typing in field', async () => {
      render(<ContactForm />)
      const nameInput = screen.getByLabelText(/name/i)
      const submitButton = screen.getByRole('button', { name: /send message/i })

      // Trigger validation error
      fireEvent.click(submitButton)
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      })

      // Type in the field
      await userEvent.type(nameInput, 'John')

      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument()
      })
    })

    it('shows multiple validation errors at once', async () => {
      render(<ContactForm />)
      const submitButton = screen.getByRole('button', { name: /send message/i })

      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
        expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    it('calls API with correct data on valid submission', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
      global.fetch = mockFetch

      render(<ContactForm />)

      // Fill out the form
      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe')
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com')
      await userEvent.type(
        screen.getByLabelText(/message/i),
        'This is a test message with enough characters.'
      )

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            message: 'This is a test message with enough characters.',
            website: '',
          }),
        })
      })
    })

    it('does not call API when validation fails', async () => {
      const mockFetch = jest.fn()
      global.fetch = mockFetch

      render(<ContactForm />)

      // Submit without filling the form
      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      })

      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('includes honeypot field in submission', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
      global.fetch = mockFetch

      render(<ContactForm />)

      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe')
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com')
      await userEvent.type(screen.getByLabelText(/message/i), 'This is a test message.')

      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
      })

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(callBody).toHaveProperty('website')
      expect(callBody.website).toBe('')
    })
  })

  describe('Loading State', () => {
    it('shows loading spinner during submission', async () => {
      const mockFetch = jest.fn().mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true, message: 'Message sent successfully!' }),
                }),
              100
            )
          )
      )
      global.fetch = mockFetch

      render(<ContactForm />)

      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe')
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com')
      await userEvent.type(screen.getByLabelText(/message/i), 'This is a test message.')

      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText(/sending.../i)).toBeInTheDocument()
      })

      // Should have spinner SVG
      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    it('disables all inputs during submission', async () => {
      const mockFetch = jest.fn().mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true, message: 'Message sent successfully!' }),
                }),
              100
            )
          )
      )
      global.fetch = mockFetch

      render(<ContactForm />)

      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe')
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com')
      await userEvent.type(screen.getByLabelText(/message/i), 'This is a test message.')

      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const messageInput = screen.getByLabelText(/message/i)
      const submitButton = screen.getByRole('button', { name: /send message/i })

      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(nameInput).toBeDisabled()
        expect(emailInput).toBeDisabled()
        expect(messageInput).toBeDisabled()
        expect(submitButton).toBeDisabled()
      })
    })

    it('re-enables inputs after successful submission', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
      global.fetch = mockFetch

      render(<ContactForm />)

      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe')
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com')
      await userEvent.type(screen.getByLabelText(/message/i), 'This is a test message.')

      const submitButton = screen.getByRole('button', { name: /send message/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
      })

      const nameInput = screen.getByLabelText(/name/i)
      expect(nameInput).not.toBeDisabled()
    })
  })

  describe('Success State', () => {
    it('displays success message after successful submission', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
      global.fetch = mockFetch

      render(<ContactForm />)

      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe')
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com')
      await userEvent.type(screen.getByLabelText(/message/i), 'This is a test message.')

      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
      })
    })

    it('clears form after successful submission', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
      global.fetch = mockFetch

      render(<ContactForm />)

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
      const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement

      await userEvent.type(nameInput, 'John Doe')
      await userEvent.type(emailInput, 'john@example.com')
      await userEvent.type(messageInput, 'This is a test message.')

      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
      })

      // Form should be cleared
      expect(nameInput.value).toBe('')
      expect(emailInput.value).toBe('')
      expect(messageInput.value).toBe('')
    })

    it('clears validation errors after successful submission', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
      global.fetch = mockFetch

      render(<ContactForm />)

      // First, trigger an error
      fireEvent.click(screen.getByRole('button', { name: /send message/i }))
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      })

      // Then fill and submit successfully
      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe')
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com')
      await userEvent.type(screen.getByLabelText(/message/i), 'This is a test message.')

      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
      })

      // Errors should be cleared
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('displays error message when API returns non-ok response', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          message: 'An unexpected error occurred',
          code: 'server_error',
        }),
      })
      global.fetch = mockFetch

      render(<ContactForm />)

      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe')
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com')
      await userEvent.type(screen.getByLabelText(/message/i), 'This is a test message.')

      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
    })

    it('displays error message when API call throws error', async () => {
      const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'))
      global.fetch = mockFetch

      render(<ContactForm />)

      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe')
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com')
      await userEvent.type(screen.getByLabelText(/message/i), 'This is a test message.')

      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
    })

    it('does not clear form data on error', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          message: 'An unexpected error occurred',
          code: 'server_error',
        }),
      })
      global.fetch = mockFetch

      render(<ContactForm />)

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
      const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement

      await userEvent.type(nameInput, 'John Doe')
      await userEvent.type(emailInput, 'john@example.com')
      await userEvent.type(messageInput, 'This is a test message.')

      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })

      // Form data should remain
      expect(nameInput.value).toBe('John Doe')
      expect(emailInput.value).toBe('john@example.com')
      expect(messageInput.value).toBe('This is a test message.')
    })

    it('shows the rate-limit message on a 429 response', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({
          success: false,
          message: 'Too many requests',
          code: 'rate_limited',
        }),
      })
      global.fetch = mockFetch

      render(<ContactForm />)

      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe')
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com')
      await userEvent.type(screen.getByLabelText(/message/i), 'This is a test message.')

      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(screen.getByText(/too many messages/i)).toBeInTheDocument()
      })
    })

    it('maps server-side validation details onto field errors', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          message: 'Validation failed',
          code: 'validation_error',
          details: [{ field: 'email', message: 'Invalid email address' }],
        }),
      })
      global.fetch = mockFetch

      render(<ContactForm />)

      // Client validation is bypassed here by typing values the client
      // accepts; the server response drives the error display.
      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe')
      await userEvent.type(screen.getByLabelText(/email/i), 'john@weird-but-client-ok.x')
      await userEvent.type(screen.getByLabelText(/message/i), 'This is a test message.')

      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
      })
      // Field-level errors, not the generic banner
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows the generic error when the response body is not JSON', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => {
          throw new Error('not json')
        },
      })
      global.fetch = mockFetch

      render(<ContactForm />)

      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe')
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com')
      await userEvent.type(screen.getByLabelText(/message/i), 'This is a test message.')

      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
    })
  })
})
