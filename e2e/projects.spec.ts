import { test, expect } from '@playwright/test'

test.describe('Projects Page', () => {
  test('navigates to projects page successfully', async ({ page }) => {
    await page.goto('/projects')

    // Verify page title/heading
    await expect(page.locator('h1')).toContainText('Projects')
    await expect(page).toHaveURL('/projects')
  })

  test('displays project cards on projects page', async ({ page }) => {
    await page.goto('/projects')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Check that at least one project card is visible
    const projectCards = page.locator('article')
    await expect(projectCards.first()).toBeVisible()
  })

  test('clicks a project card and navigates to project detail page', async ({ page }) => {
    await page.goto('/projects')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Click the first project card
    const firstProject = page.locator('article').first()
    await firstProject.click()
    await page.waitForURL(/\/projects\/.+/)

    // Should navigate to a project detail page
    await expect(page.url()).toMatch(/\/projects\/.+/)

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Verify content is visible (project details should have heading)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('navigates back from project detail to projects list', async ({ page }) => {
    await page.goto('/projects')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Click the first project card
    await page.locator('article').first().click()
    await page.waitForURL(/\/projects\/.+/)

    // Should be on project detail page
    await expect(page.url()).toMatch(/\/projects\/.+/)
    await page.waitForLoadState('networkidle')

    // Click back button
    await page.getByRole('link', { name: 'Back to Projects' }).first().click()

    // Should be back on projects list page
    await expect(page).toHaveURL('/projects')
    await expect(page.locator('h1')).toContainText('Projects')
  })

  test('all project cards have required content', async ({ page }) => {
    await page.goto('/projects')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    const projectCards = page.locator('article')
    const count = await projectCards.count()

    // Verify there is at least one project
    expect(count).toBeGreaterThan(0)

    // Check first project card has title (h2 or h3)
    const firstCard = projectCards.first()
    const hasHeading =
      (await firstCard.locator('h2').count()) > 0 || (await firstCard.locator('h3').count()) > 0
    expect(hasHeading).toBeTruthy()
  })

  test('project detail page loads all content correctly', async ({ page }) => {
    await page.goto('/projects')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Click the first project
    await page.locator('article').first().click()
    await page.waitForURL(/\/projects\/.+/)

    // Wait for project detail page to load
    await page.waitForLoadState('networkidle')

    // Verify essential elements are present
    await expect(page.locator('h1')).toBeVisible()

    // Back button should be visible
    await expect(page.locator('text=Back to Projects')).toBeVisible()
  })

  test('browser back button works from project detail', async ({ page }) => {
    await page.goto('/projects')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Click the first project card
    await page.locator('article').first().click()
    await page.waitForURL(/\/projects\/.+/)

    // Should be on project detail page
    await expect(page.url()).toMatch(/\/projects\/.+/)
    await page.waitForLoadState('networkidle')

    // Use browser back button
    await page.goBack()

    // Should be back on projects list page
    await expect(page).toHaveURL('/projects')
    await expect(page.locator('h1')).toContainText('Projects')
  })

  test('project cards are clickable/interactive', async ({ page }) => {
    await page.goto('/projects')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    const firstProject = page.locator('article').first()

    // Hover over the card (should have hover effects)
    await firstProject.hover()

    // Card should be clickable
    await expect(firstProject).toBeVisible()

    // Click should work
    await firstProject.click()
    await page.waitForURL(/\/projects\/.+/)
    await expect(page.url()).toMatch(/\/projects\/.+/)
  })

  test('projects page handles no projects gracefully', async ({ page }) => {
    // This test ensures the page doesn't crash if there are no projects
    await page.goto('/projects')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Page should still have main heading
    await expect(page.locator('h1')).toBeVisible()
  })

  test('project images load correctly', async ({ page }) => {
    await page.goto('/projects')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Check if any images exist
    const images = page.locator('article img')
    const imageCount = await images.count()

    if (imageCount > 0) {
      // If images exist, verify they load
      const firstImage = images.first()
      await expect(firstImage).toBeVisible()

      // Card images are decorative (the card title conveys the name), so
      // they must carry an explicit empty alt rather than a missing one
      await expect(firstImage).toHaveAttribute('alt', '')
    }
  })

  test('multiple project cards can be navigated sequentially', async ({ page }) => {
    await page.goto('/projects')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    const projectCards = page.locator('article')
    const count = await projectCards.count()

    if (count > 1) {
      // Click first project
      await projectCards.nth(0).click()
      await page.waitForURL(/\/projects\/.+/)
      await expect(page.url()).toMatch(/\/projects\/.+/)
      const firstUrl = page.url()

      // Go back
      await page.getByRole('link', { name: 'Back to Projects' }).first().click()
      await expect(page).toHaveURL('/projects')

      // Click second project
      await projectCards.nth(1).click()
      await page.waitForURL(/\/projects\/.+/)
      await expect(page.url()).toMatch(/\/projects\/.+/)
      const secondUrl = page.url()

      // URLs should be different
      expect(firstUrl).not.toBe(secondUrl)
    }
  })
})
