import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('fills all form fields and submits successfully', async ({ page }) => {
    // Fill out the form
    await page.fill('#name', 'John Doe')
    await page.fill('#email', 'john.doe@example.com')
    await page.fill('#message', 'This is a test message with more than 10 characters.')

    // Mock successful API response
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })

    // Submit the form
    await page.click('button[type="submit"]')

    // Wait for success message
    await expect(page.locator('text=Message sent successfully')).toBeVisible({ timeout: 5000 })

    // Verify form is cleared
    await expect(page.locator('#name')).toHaveValue('')
    await expect(page.locator('#email')).toHaveValue('')
    await expect(page.locator('#message')).toHaveValue('')
  })

  test('shows validation error for empty name field', async ({ page }) => {
    // Try to submit with empty name
    await page.fill('#email', 'john.doe@example.com')
    await page.fill('#message', 'This is a test message with more than 10 characters.')

    await page.click('button[type="submit"]')

    // Verify error message appears
    await expect(page.locator('text=Name is required')).toBeVisible()
  })

  test('shows validation error for empty email field', async ({ page }) => {
    // Try to submit with empty email
    await page.fill('#name', 'John Doe')
    await page.fill('#message', 'This is a test message with more than 10 characters.')

    await page.click('button[type="submit"]')

    // Verify error message appears
    await expect(page.locator('text=Invalid email address')).toBeVisible()
  })

  test('shows validation error for invalid email format', async ({ page }) => {
    // Try to submit with invalid email
    await page.fill('#name', 'John Doe')
    await page.fill('#email', 'invalid-email')
    await page.fill('#message', 'This is a test message with more than 10 characters.')

    await page.click('button[type="submit"]')

    // Verify error message appears
    await expect(page.locator('text=Invalid email address')).toBeVisible()
  })

  test('shows validation error for empty message field', async ({ page }) => {
    // Try to submit with empty message
    await page.fill('#name', 'John Doe')
    await page.fill('#email', 'john.doe@example.com')

    await page.click('button[type="submit"]')

    // Verify error message appears
    await expect(page.locator('text=Message must be at least 10 characters')).toBeVisible()
  })

  test('shows validation error for short message', async ({ page }) => {
    // Try to submit with message too short (less than 10 characters)
    await page.fill('#name', 'John Doe')
    await page.fill('#email', 'john.doe@example.com')
    await page.fill('#message', 'Short')

    await page.click('button[type="submit"]')

    // Verify error message appears
    await expect(page.locator('text=Message must be at least 10 characters')).toBeVisible()
  })

  test('shows validation error for whitespace-only name', async ({ page }) => {
    await page.fill('#name', '   ')
    await page.fill('#email', 'john.doe@example.com')
    await page.fill('#message', 'This is a test message with more than 10 characters.')

    await page.click('button[type="submit"]')

    // Verify error message appears
    await expect(page.locator('text=Name is required')).toBeVisible()
  })

  test('shows multiple validation errors when multiple fields are empty', async ({ page }) => {
    // Try to submit with all fields empty
    await page.click('button[type="submit"]')

    // Verify all error messages appear
    await expect(page.locator('text=Name is required')).toBeVisible()
    await expect(page.locator('text=Invalid email address')).toBeVisible()
    await expect(page.locator('text=Message must be at least 10 characters')).toBeVisible()
  })

  test('handles API error (500 response) gracefully', async ({ page }) => {
    // Fill out the form
    await page.fill('#name', 'John Doe')
    await page.fill('#email', 'john.doe@example.com')
    await page.fill('#message', 'This is a test message with more than 10 characters.')

    // Mock error API response
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      })
    })

    // Submit the form
    await page.click('button[type="submit"]')

    // Wait for error message
    await expect(page.locator('text=Something went wrong')).toBeVisible({ timeout: 5000 })
  })

  test('handles network error gracefully', async ({ page }) => {
    // Fill out the form
    await page.fill('#name', 'John Doe')
    await page.fill('#email', 'john.doe@example.com')
    await page.fill('#message', 'This is a test message with more than 10 characters.')

    // Abort the request to simulate network error
    await page.route('**/api/contact', async (route) => {
      await route.abort('failed')
    })

    // Submit the form
    await page.click('button[type="submit"]')

    // Wait for error message
    await expect(page.locator('text=Something went wrong')).toBeVisible({ timeout: 5000 })
  })

  test('clears validation errors when user corrects input', async ({ page }) => {
    // Submit with empty form to trigger errors
    await page.click('button[type="submit"]')

    // Verify error appears
    await expect(page.locator('text=Name is required')).toBeVisible()

    // Fill the name field
    await page.fill('#name', 'John Doe')

    // Error should disappear
    await expect(page.locator('text=Name is required')).not.toBeVisible()
  })

  test('disables submit button while submitting', async ({ page }) => {
    // Fill out the form
    await page.fill('#name', 'John Doe')
    await page.fill('#email', 'john.doe@example.com')
    await page.fill('#message', 'This is a test message with more than 10 characters.')

    // Mock slow API response
    await page.route('**/api/contact', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })

    // Submit the form
    await page.click('button[type="submit"]')

    // Button should be disabled and show loading text
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeDisabled()
    await expect(submitButton).toContainText('Sending')
  })

  test('has proper accessibility labels', async ({ page }) => {
    // Check that all form fields have labels
    await expect(page.locator('label[for="name"]')).toBeVisible()
    await expect(page.locator('label[for="email"]')).toBeVisible()
    await expect(page.locator('label[for="message"]')).toBeVisible()

    // Check that submit button has proper text
    await expect(page.locator('button[type="submit"]')).toContainText('Send Message')
  })
})
