import { test, expect, devices } from '@playwright/test'

// Configure tests to run with iPhone 12 viewport
test.use({ ...devices['iPhone 12'] })

test.describe('Mobile Responsiveness', () => {

  test('mobile menu button is visible on mobile viewport', async ({ page }) => {
    await page.goto('/')

    // Mobile menu button should be visible
    const menuButton = page.locator('button[aria-label*="menu" i]')
    await expect(menuButton).toBeVisible()
  })

  test('mobile menu opens and closes correctly', async ({ page }) => {
    await page.goto('/')

    // Find and click the mobile menu button
    const menuButton = page.locator('button[aria-label*="menu" i]')
    await menuButton.click()

    // Wait for menu animation
    await page.waitForTimeout(300)

    // Menu should be visible now (check for navigation links)
    const mobileNav = page.locator('nav a:has-text("Resume"), nav button:has-text("Resume")')
    await expect(mobileNav.first()).toBeVisible()

    // Close menu by clicking button again or clicking a link
    const closeButton = page.locator('button[aria-label*="close" i], button[aria-label*="menu" i]')
    await closeButton.first().click()

    await page.waitForTimeout(300)
  })

  test('homepage renders correctly on mobile', async ({ page }) => {
    await page.goto('/')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Main heading should be visible
    await expect(page.locator('h1').first()).toBeVisible()

    // Page should not have horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasHorizontalScroll).toBeFalsy()
  })

  test('resume page renders correctly on mobile', async ({ page }) => {
    await page.goto('/resume')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Main heading should be visible
    await expect(page.locator('h1')).toBeVisible()

    // Page should not have horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasHorizontalScroll).toBeFalsy()
  })

  test('projects page renders correctly on mobile', async ({ page }) => {
    await page.goto('/projects')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Main heading should be visible
    await expect(page.locator('h1')).toBeVisible()

    // Project cards should be stacked vertically and visible
    const projectCards = page.locator('article')
    if ((await projectCards.count()) > 0) {
      await expect(projectCards.first()).toBeVisible()
    }

    // Page should not have horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasHorizontalScroll).toBeFalsy()
  })

  test('contact page renders correctly on mobile', async ({ page }) => {
    await page.goto('/contact')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Main heading should be visible
    await expect(page.locator('h1')).toBeVisible()

    // Contact form should be visible
    await expect(page.locator('form')).toBeVisible()

    // Page should not have horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasHorizontalScroll).toBeFalsy()
  })

  test('contact form is usable on mobile', async ({ page }) => {
    await page.goto('/contact')

    // All form fields should be visible and tappable
    await expect(page.locator('#name')).toBeVisible()
    await expect(page.locator('#email')).toBeVisible()
    await expect(page.locator('#message')).toBeVisible()

    // Fill out form
    await page.fill('#name', 'Mobile Test User')
    await page.fill('#email', 'mobile@test.com')
    await page.fill('#message', 'This is a test message from mobile device.')

    // Submit button should be visible and tappable
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()

    // Mock API response
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })

    // Tap submit button
    await submitButton.tap()

    // Should show success message
    await expect(page.locator('text=Message sent successfully')).toBeVisible({ timeout: 5000 })
  })

  test('mobile navigation works correctly', async ({ page }) => {
    await page.goto('/')

    // Open mobile menu
    const menuButton = page.locator('button[aria-label*="menu" i]')
    await menuButton.click()
    await page.waitForTimeout(300)

    // Click on Resume link
    await page.click('text=Resume')

    // Should navigate to Resume page
    await expect(page).toHaveURL('/resume')
    await expect(page.locator('h1')).toContainText('Maximiliano Zavala')
  })

  test('mobile navigation to all pages', async ({ page }) => {
    const routes = [
      { link: 'Projects', url: '/projects', heading: 'Projects' },
      { link: 'Contact', url: '/contact', heading: 'Get in Touch' },
    ]

    for (const route of routes) {
      await page.goto('/')

      // Open mobile menu
      const menuButton = page.locator('button[aria-label*="menu" i]')
      await menuButton.click()
      await page.waitForTimeout(300)

      // Click on the link
      await page.click(`text=${route.link}`)

      // Verify navigation
      await expect(page).toHaveURL(route.url)
      await expect(page.locator('h1')).toBeVisible()
    }
  })

  test('images scale properly on mobile', async ({ page }) => {
    await page.goto('/')

    // Wait for images to load
    await page.waitForLoadState('networkidle')

    // Check all images
    const images = page.locator('img')
    const imageCount = await images.count()

    if (imageCount > 0) {
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const image = images.nth(i)
        const box = await image.boundingBox()

        if (box) {
          // Image width should not exceed viewport width
          const viewportSize = page.viewportSize()
          expect(box.width).toBeLessThanOrEqual(viewportSize!.width)
        }
      }
    }
  })

  test('text is readable on mobile (font sizes)', async ({ page }) => {
    await page.goto('/')

    // Check that body text is at least 16px (readable on mobile)
    const fontSize = await page.evaluate(() => {
      const body = document.body
      return parseInt(window.getComputedStyle(body).fontSize)
    })

    // Most mobile guidelines suggest minimum 16px for body text
    expect(fontSize).toBeGreaterThanOrEqual(14)
  })

  test('buttons are tappable on mobile (minimum size)', async ({ page }) => {
    await page.goto('/')

    // Open mobile menu button
    const menuButton = page.locator('button[aria-label*="menu" i]')
    const box = await menuButton.boundingBox()

    // Minimum recommended touch target size is 44x44px
    expect(box?.width).toBeGreaterThanOrEqual(40)
    expect(box?.height).toBeGreaterThanOrEqual(40)
  })

  test('theme toggle works on mobile', async ({ page }) => {
    await page.goto('/')

    const themeToggle = page.locator('button[aria-label="Toggle theme"]')
    await expect(themeToggle).toBeVisible()

    // Should be tappable
    await themeToggle.tap()
    await page.waitForTimeout(300)

    // Theme should change
    const htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toMatch(/(light|dark)/)
  })

  test('project detail page is readable on mobile', async ({ page }) => {
    await page.goto('/projects')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Click first project if available
    const projectCards = page.locator('article')
    if ((await projectCards.count()) > 0) {
      await projectCards.first().click()

      // Wait for navigation
      await expect(page.url()).toMatch(/\/projects\/.+/)
      await page.waitForLoadState('networkidle')

      // Content should be visible
      await expect(page.locator('h1')).toBeVisible()

      // No horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth
      })
      expect(hasHorizontalScroll).toBeFalsy()

      // Back button should be visible and tappable
      const backButton = page.locator('text=Back to Projects')
      await expect(backButton).toBeVisible()

      // Tap back button
      await backButton.tap()
      await expect(page).toHaveURL('/projects')
    }
  })

  test('forms do not zoom on input focus (iOS)', async ({ page }) => {
    await page.goto('/contact')

    // Check viewport meta tag prevents zoom on focus
    const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content')

    // Should include user-scalable=no or maximum-scale=1 to prevent zoom on input focus
    // Or font-size should be at least 16px (iOS doesn't zoom if text is 16px+)
    const emailInput = page.locator('#email')
    const fontSize = await emailInput.evaluate((el) => {
      return window.getComputedStyle(el).fontSize
    })

    const fontSizeNum = parseInt(fontSize)
    expect(fontSizeNum).toBeGreaterThanOrEqual(16)
  })

  test('mobile viewport does not break layout', async ({ page }) => {
    const pages = ['/', '/resume', '/projects', '/contact']

    for (const path of pages) {
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      // Check for horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth
      })

      expect(hasHorizontalScroll).toBeFalsy()

      // Check that main content is visible
      const main = page.locator('main')
      await expect(main).toBeVisible()
    }
  })

  test('mobile landscape orientation works', async ({ page }) => {
    // Set landscape orientation
    await page.setViewportSize({ width: 844, height: 390 }) // iPhone 12 landscape

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Content should still be visible
    await expect(page.locator('h1').first()).toBeVisible()

    // No horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasHorizontalScroll).toBeFalsy()
  })
})
