import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Maximiliano Zavala/)
    // The hero renders per-letter spans; the accessible name comes from aria-label
    await expect(page.getByRole('heading', { level: 1, name: 'Maximiliano Zavala' })).toBeVisible()
  })

  test('navigates to Resume page', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('navigation').getByRole('link', { name: 'Resume' }).click()
    await expect(page).toHaveURL('/about')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Maximiliano Zavala')
  })

  test('navigates to Projects page', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('navigation').getByRole('link', { name: 'Projects' }).click()
    await expect(page).toHaveURL('/projects')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Projects')
  })

  test('navigates to Contact page', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('navigation').getByRole('link', { name: 'Contact' }).click()
    await expect(page).toHaveURL('/contact')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Get in Touch')
  })

  test('navigates to project detail page and back', async ({ page }) => {
    await page.goto('/projects')

    // Click on the first project card's title link
    await page.locator('article h3 a').first().click()

    await expect(page).toHaveURL(/\/projects\/.+/)

    await page.getByRole('link', { name: 'Back to Projects' }).click()
    await expect(page).toHaveURL('/projects')
  })

  test('unknown routes show the 404 page', async ({ page }) => {
    await page.goto('/definitely-not-a-page')

    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
    await expect(page.getByRole('link', { name: /go home/i })).toBeVisible()
  })
})

test.describe('Navbar', () => {
  test('navbar is visible on all pages', async ({ page }) => {
    const pages = ['/', '/about', '/projects', '/contact']

    for (const path of pages) {
      await page.goto(path)
      const navbar = page.getByRole('navigation')
      await expect(navbar).toBeVisible()
    }
  })

  test('brand link returns to homepage', async ({ page }) => {
    await page.goto('/about')

    await page.getByRole('navigation').getByRole('link', { name: 'MZ' }).click()
    await expect(page).toHaveURL('/')
  })

  test('skip link jumps to main content', async ({ page }) => {
    await page.goto('/')

    await page.keyboard.press('Tab')
    const skipLink = page.getByRole('link', { name: /skip to main content/i })
    await expect(skipLink).toBeFocused()
  })
})

test.describe('SEO metadata', () => {
  test('subpages declare their own canonical URL, not the homepage', async ({ page }) => {
    await page.goto('/about')

    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveAttribute('href', /\/about$/)
  })

  test('sitemap and robots are served', async ({ request }) => {
    const sitemap = await request.get('/sitemap.xml')
    expect(sitemap.ok()).toBe(true)
    expect(await sitemap.text()).toContain('/projects/')

    const robots = await request.get('/robots.txt')
    expect(robots.ok()).toBe(true)
  })
})
