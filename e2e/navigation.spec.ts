import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Zavala Software Portfolio/)
    await expect(page.locator('h1')).toContainText('Zavala Software Portfolio')
  })

  test('navigates to About page', async ({ page }) => {
    await page.goto('/')

    await page.click('text=About')
    await expect(page).toHaveURL('/about')
    await expect(page.locator('h1')).toContainText('About')
  })

  test('navigates to Projects page', async ({ page }) => {
    await page.goto('/')

    await page.click('text=Projects')
    await expect(page).toHaveURL('/projects')
    await expect(page.locator('h1')).toContainText('Projects')
  })

  test('navigates to Contact page', async ({ page }) => {
    await page.goto('/')

    await page.click('text=Contact')
    await expect(page).toHaveURL('/contact')
    await expect(page.locator('h1')).toContainText('Get in Touch')
  })

  test('navigates to project detail page', async ({ page }) => {
    await page.goto('/projects')

    // Click on the first project card
    await page.click('article >> nth=0')

    // Should navigate to a project detail page
    await expect(page.url()).toMatch(/\/projects\/.+/)

    // Back button should work
    await page.click('text=Back to Projects')
    await expect(page).toHaveURL('/projects')
  })
})

test.describe('Navbar', () => {
  test('navbar is visible on all pages', async ({ page }) => {
    const pages = ['/', '/about', '/projects', '/contact']

    for (const path of pages) {
      await page.goto(path)
      const navbar = page.locator('nav')
      await expect(navbar).toBeVisible()
    }
  })

  test('brand link returns to homepage', async ({ page }) => {
    await page.goto('/about')

    await page.click('nav >> text=Zavala')
    await expect(page).toHaveURL('/')
  })
})

test.describe('Responsive', () => {
  test('mobile menu button is visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const menuButton = page.locator('button[aria-label="Open menu"]')
    await expect(menuButton).toBeVisible()
  })

  test('desktop navigation is hidden on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const desktopNav = page.locator('nav >> .hidden.md\\:flex')
    await expect(desktopNav).toBeHidden()
  })
})
