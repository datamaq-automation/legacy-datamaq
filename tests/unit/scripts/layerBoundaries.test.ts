import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const fixtureRoot = path.resolve(currentDir, '../../fixtures/layer-boundaries')

describe('layer boundaries checker', () => {
  it('detects cross-layer violations in fixture files', async () => {
    const { checkLayerBoundaries } = await import('../../../scripts/layerBoundaries.mjs')
    const report = await checkLayerBoundaries({ rootDir: fixtureRoot })

    expect(report.violations.length).toBe(1)
    expect(report.violations[0]?.rule).toBe('domain-no-outbound-to-application-infrastructure-ui')
    expect(report.violations[0]?.sourceLayer).toBe('domain')
    expect(report.violations[0]?.targetLayer).toBe('infrastructure')
  })
})
