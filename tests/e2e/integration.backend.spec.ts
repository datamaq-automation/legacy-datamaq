import { expect, test } from '@playwright/test'

let backendAvailable = false
const BACKEND_HEALTH_URL = process.env.PHP_API_HEALTH_URL ?? 'http://127.0.0.1:8899/v1/health'

test.describe('Integration E2E (real backend)', () => {
  test.beforeAll(async ({ request }) => {
    try {
      const response = await request.get(BACKEND_HEALTH_URL)
      backendAvailable = response.ok()
    } catch {
      backendAvailable = false
    }
  })

  test('contact lead flow submits and navigates to thanks', async ({ page }) => {
    test.skip(!backendAvailable, `Backend no disponible: ${BACKEND_HEALTH_URL}`)

    await page.goto('/')
    const leadSection = page.locator('#contacto-lead')
    await leadSection.scrollIntoViewIfNeeded()
    await expect(leadSection).toBeVisible()
    await expect(leadSection.locator('input[name="email"]')).toBeEnabled()
    await leadSection.locator('input[name="email"]').fill('ada@example.com')
    await leadSection
      .locator('textarea[name="message"]')
      .fill('Necesito una propuesta para mantenimiento industrial.')

    await page.getByRole('button', { name: /Registrar contacto/i }).click()

    await expect(page).toHaveURL(/\/gracias$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Gracias!' })).toBeVisible()
  })

  test('mail flow submits and navigates to thanks', async ({ page }) => {
    test.skip(!backendAvailable, `Backend no disponible: ${BACKEND_HEALTH_URL}`)

    await page.goto('/')
    const mailSection = page.locator('#contacto-mail')
    await mailSection.scrollIntoViewIfNeeded()
    await expect(mailSection).toBeVisible()
    await expect(mailSection.locator('input[name="email"]')).toBeEnabled()
    await mailSection.locator('input[name="email"]').fill('ada@example.com')
    await mailSection.locator('textarea[name="message"]').fill('Necesito enviar una consulta por correo.')

    await page.getByRole('button', { name: /Enviar consulta por correo/i }).click()

    await expect(page).toHaveURL(/\/gracias$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Gracias!' })).toBeVisible()
  })
})
