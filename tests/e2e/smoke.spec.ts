import { expect, test } from '@playwright/test'

test.describe('Smoke E2E', () => {
  test.beforeEach(async ({ page }) => {
    const healthRoutes = [
      '**/api/v1/health*',
      '**/v1/health*',
      '**/plantilla-www/public/api/v1/health*'
    ]
    for (const pattern of healthRoutes) {
      await page.route(pattern, async (route) => {
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
    }

    const pricingRoutes = [
      '**/api/v1/pricing*',
      '**/v1/pricing*',
      '**/plantilla-www/public/api/v1/pricing*'
    ]
    for (const pattern of pricingRoutes) {
      await page.route(pattern, async (route) => {
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
    }

    const contentRoutes = [
      '**/api/v1/content*',
      '**/v1/content*',
      '**/plantilla-www/public/api/v1/content*'
    ]
    for (const pattern of contentRoutes) {
      await page.route(pattern, async (route) => {
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
    }

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
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            request_id: 'e2e-request',
            submission_id: 'e2e-submission',
            status: 'accepted',
            processing_status: 'queued',
            detail: 'Submission created'
          })
        })
        return
      }

      await route.fulfill({ status: 405 })
    }

    const contactRoutes = [
      '**/api/v1/contact*',
      '**/v1/contact*',
      '**/plantilla-www/public/api/v1/contact*'
    ]
    for (const pattern of contactRoutes) {
      await page.route(pattern, fulfillContactApi)
    }

    const mailRoutes = ['**/api/v1/mail*', '**/v1/mail*', '**/plantilla-www/public/api/v1/mail*']
    for (const pattern of mailRoutes) {
      await page.route(pattern, fulfillContactApi)
    }
  })

  test('home renders core sections', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Contenido no disponible'
    )
    await expect(page.getByRole('heading', { name: 'Contenido', exact: true })).toBeVisible()
  })

  test('contact lead flow submits and navigates to thanks', async ({ page }) => {
    await page.goto('/')
    const leadSection = page.locator('#contacto-lead')
    await leadSection.scrollIntoViewIfNeeded()
    await expect(leadSection).toBeVisible()
    await leadSection.locator('input[name="email"]').fill('ada@example.com')
    await expect(leadSection.locator('textarea[name="comment"]')).toBeVisible()
    await leadSection
      .locator('textarea[name="comment"]')
      .fill('Necesito una propuesta para mantenimiento industrial.')

    await page.getByRole('button', { name: /Registrar contacto/i }).click()

    await expect(page).toHaveURL(/\/gracias$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Gracias!' })).toBeVisible()
  })

  test('mail flow submits and navigates to thanks', async ({ page }) => {
    await page.goto('/')
    const mailSection = page.locator('#contacto-mail')
    await mailSection.scrollIntoViewIfNeeded()
    await expect(mailSection).toBeVisible()
    await mailSection.locator('input[name="email"]').fill('ada@example.com')
    await expect(mailSection.locator('textarea[name="comment"]')).toBeVisible()
    await mailSection.locator('textarea[name="comment"]').fill('Necesito enviar una consulta por correo.')

    await page.getByRole('button', { name: /Enviar consulta por correo/i }).click()

    await expect(page).toHaveURL(/\/gracias$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Gracias!' })).toBeVisible()
  })

  test('thanks page returns to home', async ({ page }) => {
    await page.goto('/gracias')

    await page.getByRole('button', { name: /Volver al inicio/i }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      /Contenido no disponible|Diagnostico e instalacion electrica para pymes/i
    )
  })
})


