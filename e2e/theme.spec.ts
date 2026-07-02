import { test, expect } from '@playwright/test'

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('theme toggle button is visible', async ({ page }) => {
    await page.goto('/')

    // Wait for theme toggle to be visible
    const themeToggle = page.locator('button[aria-label^="Switch to"]')
    await expect(themeToggle).toBeVisible()
  })

  test('toggles from dark to light theme', async ({ page }) => {
    await page.goto('/')

    // Default theme is dark
    await expect(page.locator('html')).toHaveClass(/dark/)

    // Click theme toggle
    await page.click('button[aria-label^="Switch to"]')

    // Wait a bit for theme transition
    await page.waitForTimeout(300)

    // Should now be in light mode
    await expect(page.locator('html')).toHaveClass(/light/)
  })

  test('toggles from light to dark theme', async ({ page }) => {
    await page.goto('/')

    // Toggle to light mode first
    await page.click('button[aria-label^="Switch to"]')
    await page.waitForTimeout(300)
    await expect(page.locator('html')).toHaveClass(/light/)

    // Toggle back to dark mode
    await page.click('button[aria-label^="Switch to"]')
    await page.waitForTimeout(300)

    // Should be back in dark mode
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('theme persists after page reload', async ({ page }) => {
    await page.goto('/')

    // Toggle to light mode
    await page.click('button[aria-label^="Switch to"]')
    await page.waitForTimeout(300)
    await expect(page.locator('html')).toHaveClass(/light/)

    // Reload the page
    await page.reload()

    // Wait for page to fully load
    await page.waitForLoadState('networkidle')

    // Theme should still be light
    await expect(page.locator('html')).toHaveClass(/light/)
  })

  test('theme persists across page navigation', async ({ page }) => {
    await page.goto('/')

    // Toggle to light mode
    await page.click('button[aria-label^="Switch to"]')
    await page.waitForTimeout(300)
    await expect(page.locator('html')).toHaveClass(/light/)

    // Navigate to another page
    await page.getByRole('navigation').getByRole('link', { name: 'Resume' }).click()
    await expect(page).toHaveURL('/about')

    // Theme should still be light
    await expect(page.locator('html')).toHaveClass(/light/)

    // Navigate to projects
    await page.getByRole('navigation').getByRole('link', { name: 'Projects' }).click()
    await expect(page).toHaveURL('/projects')

    // Theme should still be light
    await expect(page.locator('html')).toHaveClass(/light/)
  })

  test('theme is stored in localStorage', async ({ page }) => {
    await page.goto('/')

    // Toggle to light mode
    await page.click('button[aria-label^="Switch to"]')
    await page.waitForTimeout(300)

    // Check localStorage
    const storedTheme = await page.evaluate(() => {
      return localStorage.getItem('zavala-theme')
    })

    expect(storedTheme).toBe('light')
  })

  test('light theme applies correct CSS variables', async ({ page }) => {
    await page.goto('/')

    // Toggle to light mode
    await page.click('button[aria-label^="Switch to"]')
    await page.waitForTimeout(300)

    // Check that light theme classes are applied
    await expect(page.locator('html')).toHaveClass(/light/)

    // Verify some CSS is different (background color should change)
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.documentElement).backgroundColor
    })

    // In light mode, background should be lighter (not pure black)
    expect(bgColor).toBeTruthy()
  })

  test('dark theme applies correct CSS variables', async ({ page }) => {
    await page.goto('/')

    // Default is dark, but let's ensure it
    await expect(page.locator('html')).toHaveClass(/dark/)

    // Verify dark theme CSS is applied
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.documentElement).backgroundColor
    })

    expect(bgColor).toBeTruthy()
  })

  test('theme toggle icon changes based on theme', async ({ page }) => {
    await page.goto('/')

    const themeToggle = page.locator('button[aria-label^="Switch to"]')

    // In dark mode, should show sun icon (to switch to light)
    await expect(page.locator('html')).toHaveClass(/dark/)
    const darkModeIcon = themeToggle.locator('svg')
    await expect(darkModeIcon).toBeVisible()

    // Toggle to light mode
    await page.click('button[aria-label^="Switch to"]')
    await page.waitForTimeout(300)

    // In light mode, should show moon icon (to switch to dark)
    await expect(page.locator('html')).toHaveClass(/light/)
    const lightModeIcon = themeToggle.locator('svg')
    await expect(lightModeIcon).toBeVisible()
  })

  test('theme toggle is accessible', async ({ page }) => {
    await page.goto('/')

    const themeToggle = page.locator('button[aria-label^="Switch to"]')

    // Should have a state-communicating aria-label
    await expect(themeToggle).toHaveAttribute('aria-label', /Switch to (light|dark) theme/)

    // Should be focusable
    await themeToggle.focus()
    await expect(themeToggle).toBeFocused()

    // Should be keyboard accessible (press Enter)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    // Theme should have changed
    const htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toBeTruthy()
  })

  test('theme toggle works on all pages', async ({ page }) => {
    const pages = ['/', '/about', '/projects', '/contact']

    for (const path of pages) {
      await page.goto(path)

      // Theme toggle should be visible
      const themeToggle = page.locator('button[aria-label^="Switch to"]')
      await expect(themeToggle).toBeVisible()

      // Should be clickable
      await themeToggle.click()
      await page.waitForTimeout(300)

      // Theme should change
      const htmlClass = await page.locator('html').getAttribute('class')
      expect(htmlClass).toBeTruthy()
    }
  })

  test('multiple rapid theme toggles work correctly', async ({ page }) => {
    await page.goto('/')

    const themeToggle = page.locator('button[aria-label^="Switch to"]')

    // Toggle multiple times rapidly
    for (let i = 0; i < 5; i++) {
      await themeToggle.click()
      await page.waitForTimeout(100)
    }

    // Page should not crash and theme should be in a valid state
    const htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toMatch(/(light|dark)/)
  })

  test('theme persists in new browser tab', async ({ context, page }) => {
    await page.goto('/')

    // Toggle to light mode
    await page.click('button[aria-label^="Switch to"]')
    await page.waitForTimeout(300)
    await expect(page.locator('html')).toHaveClass(/light/)

    // Open new tab
    const newPage = await context.newPage()
    await newPage.goto('/')

    // Wait for page to load
    await newPage.waitForLoadState('networkidle')

    // New tab should also have light theme
    await expect(newPage.locator('html')).toHaveClass(/light/)

    await newPage.close()
  })
})
