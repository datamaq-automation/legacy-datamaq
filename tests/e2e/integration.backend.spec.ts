import { expect, test, type Locator } from '@playwright/test'

let backendAvailable = false
const BACKEND_HEALTH_URL = process.env.FASTAPI_HEALTH_URL ?? 'http://127.0.0.1:8899/v1/health'

async function expectChannelReady(section: Locator, submitLabel: RegExp) {
  const unavailableNotice = section.locator('.c-contact__alert')
  if (await unavailableNotice.isVisible().catch(() => false)) {
    const detail = (await unavailableNotice.textContent())?.trim() || 'Canal no disponible'
    throw new Error(`Backend reachable pero canal deshabilitado para el formulario: ${detail}`)
  }

  const submitButton = section.getByRole('button', { name: submitLabel })
  await expect(submitButton).toBeVisible()
  await expect(submitButton).toBeEnabled()
  return submitButton
}

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
    test.slow()

    await page.goto('/')
    const leadSection = page.locator('#contacto')
    await leadSection.scrollIntoViewIfNeeded()
    await expect(leadSection).toBeVisible()
    await expect(leadSection.locator('input[name="email"]')).toBeEnabled()
    await leadSection.locator('input[name="email"]').fill('ada@example.com')
    await leadSection
      .locator('textarea[name="comment"]')
      .fill('Necesito una propuesta para mantenimiento industrial.')

    const submitButton = await expectChannelReady(leadSection, /Enviar solicitud/i)
    await submitButton.click()

    await expect(page).toHaveURL(/\/gracias$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('mail flow submits and navigates to thanks', async ({ page }) => {
    test.skip(!backendAvailable, `Backend no disponible: ${BACKEND_HEALTH_URL}`)
    test.slow()

    await page.goto('/')
    const mailSection = page.locator('#contacto-mail')
    await mailSection.scrollIntoViewIfNeeded()
    await expect(mailSection).toBeVisible()
    await expect(mailSection.locator('input[name="email"]')).toBeEnabled()
    await mailSection.locator('input[name="email"]').fill('ada@example.com')
    await mailSection.locator('textarea[name="comment"]').fill('Necesito enviar una consulta por correo.')

    const submitButton = await expectChannelReady(mailSection, /Enviar por email/i)
    await submitButton.click()

    await expect(page).toHaveURL(/\/gracias$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
