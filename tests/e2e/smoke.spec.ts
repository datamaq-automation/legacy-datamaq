import { expect, test } from '@playwright/test'

const HOME_H1_PATTERN =
  /Diagnostico e instalacion electrica|Servicio Tecnico Industrial Especializado|Contenido no disponible/i

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

    const siteRoutes = ['**/api/v1/site*', '**/v1/site*', '**/plantilla-www/public/api/v1/site*']
    for (const pattern of siteRoutes) {
      await page.route(pattern, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'ok',
            data: {
              seo: { title: 'E2E Site' },
              brand: { name: 'Datamaq' }
            }
          })
        })
      })
    }

    const fulfillQuoteApi = async (route: any) => {
      const method = route.request().method()
      if (method !== 'POST') {
        await route.fulfill({ status: 405 })
        return
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          quote_id: 'Q-20260309-000777',
          list_price_ars: 280000,
          discounts: [
            {
              code: 'pre-agenda',
              label: 'Agenda confirmada',
              amount_ars: 28000
            }
          ],
          discount_pct: 10,
          discount_total_ars: 28000,
          final_price_ars: 252000,
          deposit_pct: 50,
          deposit_ars: 126000,
          valid_until: '2026-03-15T00:00:00Z',
          whatsapp_message: 'Hola Ada, confirmamos el servicio',
          whatsapp_url: 'https://wa.me/5491111111111?text=Hola'
        })
      })
    }

    const quoteRoutes = [
      '**/api/v1/quote/diagnostic*',
      '**/v1/quote/diagnostic*',
      '**/plantilla-www/public/api/v1/quote/diagnostic*'
    ]
    for (const pattern of quoteRoutes) {
      await page.route(pattern, fulfillQuoteApi)
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

  })

  test('home renders core sections', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toContainText(HOME_H1_PATTERN)
    await expect(page.locator('#servicios')).toBeVisible()
  })

  test('contact lead flow submits and navigates to thanks', async ({ page }) => {
    await page.goto('/')
    const leadSection = page.locator('#contacto')
    await leadSection.scrollIntoViewIfNeeded()
    await expect(leadSection).toBeVisible()
    await test.step('Paso 1: completar identidad', async () => {
      await leadSection.getByLabel(/nombre/i).fill('Ada')
      await leadSection.getByLabel(/apellido/i).fill('Lovelace')
      await leadSection.getByRole('button', { name: /continuar/i }).click()
    })

    await test.step('Paso 2: completar proyecto', async () => {
      await leadSection.getByLabel(/empresa/i).fill('Datamaq SRL')
      const projectDescription = leadSection.getByLabel(/descripci[oó]n del proyecto/i)
      await expect(projectDescription).toBeVisible()
      await projectDescription.fill('Necesito una propuesta para mantenimiento industrial.')
      await leadSection.getByRole('button', { name: /continuar/i }).click()
    })

    await test.step('Paso 3: completar contacto y enviar', async () => {
      await leadSection.locator('input[type="tel"]').fill('+54 9 11 1234 5678')
      await page.getByRole('button', { name: /enviar solicitud/i }).click()
    })

    await expect(page).toHaveURL(/\/gracias$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('thanks page returns to home', async ({ page }) => {
    await page.goto('/gracias')

    await page.locator('.thanks-actions__home').click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(HOME_H1_PATTERN)
  })

  test('quote flow opens the web quote view', async ({ page }) => {
    await page.goto('/cotizador')

    await page.getByLabel(/empresa/i).fill('Datamaq SRL')
    await page.getByLabel(/nombre de contacto/i).fill('Ada')
    await page.getByLabel(/localidad/i).fill('Escobar')

    const yesButtons = page.getByRole('button', { name: /^Sí$/ })
    await yesButtons.nth(0).click()
    await yesButtons.nth(1).click()
    await yesButtons.nth(2).click()

    await page.getByRole('button', { name: /generar propuesta/i }).click()
    await expect(page.getByText('Q-20260309-000777')).toBeVisible()

    await page.getByRole('button', { name: /ver versión web/i }).click()

    await expect(page).toHaveURL(/\/cotizador\/Q-20260309-000777\/web$/)
    await expect(page.getByRole('heading', { level: 1, name: 'DATAMAQ' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Confirmar en un clic' })).toBeVisible()
  })
})


