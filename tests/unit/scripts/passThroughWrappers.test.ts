import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const fixtureRoot = path.resolve(currentDir, '../../fixtures/pass-through-wrappers/src')

describe('pass-through wrappers checker', () => {
  it('flags obvious wrappers and ignores files with visible policy', async () => {
    const { checkPassThroughWrappers } = await import('../../../scripts/check-pass-through-wrappers.mjs')
    const report = await checkPassThroughWrappers({ rootDir: fixtureRoot })

    expect(report.scannedFiles).toBe(2)
    expect(report.violations).toEqual([
      expect.objectContaining({
        filePath: expect.stringContaining('trivialController.ts')
      })
    ])
  })
})
