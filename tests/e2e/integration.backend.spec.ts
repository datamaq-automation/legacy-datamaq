import { expect, test } from '@playwright/test'

test.describe('Integration E2E (real backend)', () => {
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
})
