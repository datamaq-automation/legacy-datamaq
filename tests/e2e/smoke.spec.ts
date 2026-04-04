import { expect, test } from '@playwright/test'

const HOME_H1_PATTERN =
  /Diagnostico e instalacion electrica|Servicio Tecnico Industrial Especializado|Instalación e integración de equipos IoT para energía y producción|Contenido no disponible/i

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
      await leadSection.getByRole('button', { name: /continua|continuá/i }).click()
    })

    await test.step('Paso 2: completar proyecto', async () => {
      await leadSection.getByLabel(/empresa/i).fill('Datamaq SRL')
      const projectDescription = leadSection.getByLabel(/descripci[oó]n del proyecto/i)
      await expect(projectDescription).toBeVisible()
      await projectDescription.fill('Necesito una propuesta para mantenimiento industrial.')
      await leadSection.getByRole('button', { name: /continua|continuá/i }).click()
    })

    await test.step('Paso 3: completar contacto y enviar', async () => {
      await leadSection.locator('input[type="tel"]').fill('+54 9 11 1234 5678')
      await page.getByRole('button', { name: /envia|enviá.*solicitud/i }).click()
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

  test('mobile viewport keeps core flows operable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(HOME_H1_PATTERN)

    await page.goto('/gracias')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
