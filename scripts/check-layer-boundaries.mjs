import { checkLayerBoundaries } from './layerBoundaries.mjs'

const report = await checkLayerBoundaries()

for (const violation of report.violations) {
  console.error(
    `[layer-boundaries] ${violation.rule} source=${violation.sourceLayer} target=${violation.targetLayer} file=${violation.filePath} import=${violation.importPath}`
  )
}

if (report.violations.length > 0) {
  process.exit(1)
}

console.log(`[layer-boundaries] scanned=${report.scannedFiles} violations=0`)
