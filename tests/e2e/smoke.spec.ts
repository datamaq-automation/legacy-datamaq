import { expect, test } from '@playwright/test'

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
