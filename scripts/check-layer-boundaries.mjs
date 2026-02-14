import path from 'node:path'
import { checkLayerBoundaries } from './layerBoundaries.mjs'

const rootDir = process.cwd()
const report = await checkLayerBoundaries({ rootDir })

if (report.violations.length === 0) {
  console.log('Layer boundaries OK.')
  process.exit(0)
}

console.error(`Layer boundaries violations found: ${report.violations.length}`)
for (const violation of report.violations) {
  const location = `${violation.file}:${violation.line}`
  console.error(
    `- ${location} (${violation.rule}) ${violation.sourceLayer} -> ${violation.targetLayer} via "${violation.specifier}"`
  )
}

console.error(`\nFix the imports above to satisfy architectural boundaries.`)
process.exit(1)
