import { expect, test, type Locator } from '@playwright/test'

async function isInsideViewport(locator: Locator) {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    return rect.top >= 0 && rect.bottom <= window.innerHeight
  })
}

test.describe('Smoke E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/contact', async (route) => {
      const method = route.request().method()
      if (method === 'OPTIONS') {
        await route.fulfill({
          status: 204,
          headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'POST, OPTIONS',
            'access-control-allow-headers': 'content-type'
          }
        })
        return
      }

      if (method === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true })
        })
        return
      }

      await route.continue()
    })
  })

  test('home renders hero and services', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Servicios industriales prolijos'
    )
    await expect(page.getByRole('heading', { name: 'Servicios', exact: true })).toBeVisible()
  })

  test('mobile hero keeps headline, support copy and primary CTA above fold', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 })
    await page.goto('/')

    const hero = page.locator('.c-hero').first()
    const heading = hero.getByRole('heading', { level: 1 })
    const subtitle = hero.locator('.c-hero__subtitle')
    const primaryCta = hero.getByRole('link', { name: 'WhatsApp' })

    await expect(heading).toBeVisible()
    await expect(subtitle).toBeVisible()
    await expect(primaryCta).toBeVisible()

    expect(await isInsideViewport(heading)).toBe(true)
    expect(await isInsideViewport(subtitle)).toBe(true)
    expect(await isInsideViewport(primaryCta)).toBe(true)
  })

  test('mobile menu closes with Escape and restores focus', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 })
    await page.goto('/')

    const menuToggle = page.locator('button[aria-controls="main-navbar"]')

    await menuToggle.click()
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('#main-navbar')).toBeVisible()
    expect(await page.evaluate(() => document.body.classList.contains('has-open-menu'))).toBe(
      true
    )

    await page.keyboard.press('Escape')

    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false')
    await expect(menuToggle).toBeFocused()
    expect(await page.evaluate(() => document.body.classList.contains('has-open-menu'))).toBe(
      false
    )
  })

  test('contact flow submits and navigates to thanks', async ({ page }) => {
    await page.goto('/')

    await page.fill('#contacto-nombre', 'Ada')
    await page.fill('#contacto-apellido', 'Lovelace')
    await page.fill('#contacto-email', 'ada@example.com')
    await page.fill('#contacto-empresa', 'Analytical Engines')

    await page.getByRole('button', { name: /Enviar consulta por correo/i }).click()

    await expect(page).toHaveURL(/\/gracias$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Gracias!' })).toBeVisible()
  })

  test('thanks page returns to home', async ({ page }) => {
    await page.goto('/gracias')

    await page.getByRole('button', { name: /Volver al inicio/i }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Servicios industriales prolijos'
    )
  })
})
