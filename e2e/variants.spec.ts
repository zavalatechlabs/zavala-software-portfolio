import { test, expect } from '@playwright/test'

test.describe('Design Variants', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('switcher is visible and lists all variants', async ({ page }) => {
    const trigger = page.getByRole('button', { name: /switch design variant/i })
    await expect(trigger).toBeVisible()

    await trigger.click()

    const panel = page.getByRole('radiogroup', { name: /design variant/i })
    await expect(panel).toBeVisible()
    await expect(page.getByRole('radio', { name: /classic/i })).toBeVisible()
    await expect(page.getByRole('radio', { name: /aurora/i })).toBeVisible()
    await expect(page.getByRole('radio', { name: /terminal/i })).toBeVisible()
  })

  test('classic is the default with no variant attribute', async ({ page }) => {
    const attribute = await page.evaluate(() =>
      document.documentElement.getAttribute('data-variant')
    )
    expect(attribute).toBeNull()
  })

  test('selecting Aurora applies the skin and mounts its effect layer', async ({ page }) => {
    await page.getByRole('button', { name: /switch design variant/i }).click()
    await page.getByRole('radio', { name: /aurora/i }).click()

    await expect(page.locator('html')).toHaveAttribute('data-variant', 'aurora')
    await expect(page.getByTestId('aurora-field')).toBeAttached()

    // The palette actually changed: the page background is no longer the classic near-black
    const background = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim()
    )
    expect(background).toBe('#060714')
  })

  test('selecting Terminal applies the skin and mounts its overlay', async ({ page }) => {
    await page.getByRole('button', { name: /switch design variant/i }).click()
    await page.getByRole('radio', { name: /terminal/i }).click()

    await expect(page.locator('html')).toHaveAttribute('data-variant', 'terminal')
    await expect(page.getByTestId('terminal-overlay')).toBeAttached()
  })

  test('variant persists across reload with no flash-of-classic', async ({ page }) => {
    await page.getByRole('button', { name: /switch design variant/i }).click()
    await page.getByRole('radio', { name: /terminal/i }).click()
    await expect(page.locator('html')).toHaveAttribute('data-variant', 'terminal')

    await page.reload()

    // The pre-hydration script applies the attribute before React loads
    await expect(page.locator('html')).toHaveAttribute('data-variant', 'terminal')
  })

  test('variant persists across navigation', async ({ page }) => {
    await page.getByRole('button', { name: /switch design variant/i }).click()
    await page.getByRole('radio', { name: /aurora/i }).click()

    await page.getByRole('navigation').getByRole('link', { name: 'Projects' }).click()
    await expect(page).toHaveURL('/projects')
    await expect(page.locator('html')).toHaveAttribute('data-variant', 'aurora')
  })

  test('switching back to Classic removes the attribute and effect layers', async ({ page }) => {
    await page.getByRole('button', { name: /switch design variant/i }).click()
    await page.getByRole('radio', { name: /aurora/i }).click()
    await expect(page.locator('html')).toHaveAttribute('data-variant', 'aurora')

    await page.getByRole('button', { name: /switch design variant/i }).click()
    await page.getByRole('radio', { name: /classic/i }).click()

    await expect(page.locator('html')).not.toHaveAttribute('data-variant')
    await expect(page.getByTestId('aurora-field')).not.toBeAttached()
  })

  test('Escape closes the picker and returns focus to the trigger', async ({ page }) => {
    const trigger = page.getByRole('button', { name: /switch design variant/i })
    await trigger.click()
    await expect(page.getByRole('radiogroup')).toBeVisible()

    await page.keyboard.press('Escape')

    await expect(page.getByRole('radiogroup')).not.toBeVisible()
    await expect(trigger).toBeFocused()
  })
})
