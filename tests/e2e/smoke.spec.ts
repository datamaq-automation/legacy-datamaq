import { expect, test } from '@playwright/test'

test.describe('Smoke E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/health.php', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'ok',
          service: 'e2e-api',
          brand_id: 'e2e',
          version: 'v1',
          timestamp: '2026-02-26T00:00:00Z'
        })
      })
    })

    await page.route('**/api/pricing.php', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'ok',
          data: {
            diagnostico_lista_2h_ars: 275000
          }
        })
      })
    })

    await page.route('**/api/content.php', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'ok',
          data: {
            hero: {
              title: 'Diagnostico e instalacion electrica para pymes'
            }
          }
        })
      })
    })

    const fulfillContactApi = async (route: any) => {
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
          body: JSON.stringify({ status: 'ok', request_id: 'e2e-request' })
        })
        return
      }

      await route.fulfill({ status: 405 })
    }

    await page.route('**/api/contact.php', fulfillContactApi)
    await page.route('**/api/mail.php', fulfillContactApi)
  })

  test('home renders core sections', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Diagnostico e instalacion electrica para pymes'
    )
    await expect(page.getByRole('heading', { name: 'Servicios', exact: true })).toBeVisible()
  })

  test('contact lead flow submits and navigates to thanks', async ({ page }) => {
    await page.goto('/')
    await page.fill('#contacto-lead-email', 'ada@example.com')
    await page.fill('#contacto-lead-mensaje', 'Necesito una propuesta para mantenimiento industrial.')

    await page.getByRole('button', { name: /Registrar contacto/i }).click()

    await expect(page).toHaveURL(/\/gracias$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Gracias!' })).toBeVisible()
  })

  test('mail flow submits and navigates to thanks', async ({ page }) => {
    await page.goto('/')
    await page.fill('#contacto-mail-email', 'ada@example.com')
    await page.fill('#contacto-mail-mensaje', 'Necesito enviar una consulta por correo.')

    await page.getByRole('button', { name: /Enviar consulta por correo/i }).click()

    await expect(page).toHaveURL(/\/gracias$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Gracias!' })).toBeVisible()
  })

  test('thanks page returns to home', async ({ page }) => {
    await page.goto('/gracias')

    await page.getByRole('button', { name: /Volver al inicio/i }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Diagnostico e instalacion electrica para pymes'
    )
  })
})
