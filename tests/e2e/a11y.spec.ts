import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

function registerCommonBackendMocks(page: Page) {
  const routes = ['**/api/v1/health*', '**/v1/health*', '**/plantilla-www/public/api/v1/health*']
  return Promise.all(
    routes.map((pattern) =>
      page.route(pattern, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'ok' })
        })
      })
    )
  )
}

async function assertBasicA11ySemantics(page: Page) {
  await expect(page.getByRole('main')).toBeVisible()
  const headings = page.getByRole('heading', { level: 1 })
  await expect(headings.first()).toBeVisible()
}

test.describe('A11y smoke', () => {
  test.beforeEach(async ({ page }) => {
    await registerCommonBackendMocks(page)
  })

  test('home exposes main landmark and heading', async ({ page }) => {
    await page.goto('/')
    await assertBasicA11ySemantics(page)
  })

  test('quote page exposes main landmark and heading', async ({ page }) => {
    await page.goto('/cotizador')
    await assertBasicA11ySemantics(page)
  })

  test('thanks page exposes main landmark and heading', async ({ page }) => {
    await page.goto('/gracias')
    await assertBasicA11ySemantics(page)
  })
})
