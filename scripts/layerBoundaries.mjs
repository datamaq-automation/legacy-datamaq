import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SOURCE_DIR = 'src'
const FILE_PATTERN = /\.(ts|tsx|js|jsx|vue|mjs|cjs)$/
const IMPORT_PATTERN = /import\s+(?:[^'"`]+?\s+from\s+)?['"`]([^'"`]+)['"`]/g

const BOUNDARY_RULES = [
  {
    source: 'domain',
    forbiddenTargets: new Set(['application', 'infrastructure', 'ui']),
    rule: 'domain-no-outbound-to-application-infrastructure-ui'
  }
]

export async function checkLayerBoundaries({
  rootDir = process.cwd()
} = {}) {
  const sourceRoot = path.resolve(rootDir, SOURCE_DIR)
  const files = await collectSourceFiles(sourceRoot)
  const violations = []

  for (const filePath of files) {
    const sourceLayer = detectLayer(filePath, sourceRoot)
    if (!sourceLayer) {
      continue
    }

    const content = await fs.readFile(filePath, 'utf8')
    for (const importPath of extractImports(content)) {
      const targetLayer = detectLayerFromImport(sourceRoot, filePath, importPath)
      if (!targetLayer) {
        continue
      }
      for (const boundary of BOUNDARY_RULES) {
        if (boundary.source !== sourceLayer) {
          continue
        }
        if (!boundary.forbiddenTargets.has(targetLayer)) {
          continue
        }
        violations.push({
          filePath,
          sourceLayer,
          targetLayer,
          importPath,
          rule: boundary.rule
        })
      }
    }
  }

  return {
    scannedFiles: files.length,
    violations
  }
}

async function collectSourceFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true }).catch(() => [])
  const files = []

  for (const entry of entries) {
    const absolutePath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectSourceFiles(absolutePath)))
      continue
    }
    if (FILE_PATTERN.test(entry.name)) {
      files.push(absolutePath)
    }
  }

  return files
}

function detectLayer(filePath, sourceRoot) {
  const relativePath = path.relative(sourceRoot, filePath).replace(/\\/g, '/')
  const topLevel = relativePath.split('/')[0]
  if (topLevel === 'domain' || topLevel === 'application' || topLevel === 'infrastructure' || topLevel === 'ui') {
    return topLevel
  }
  return undefined
}

function extractImports(content) {
  const imports = []
  let match = IMPORT_PATTERN.exec(content)
  while (match) {
    const value = match[1]?.trim()
    if (value) {
      imports.push(value)
    }
    match = IMPORT_PATTERN.exec(content)
  }
  return imports
}

function detectLayerFromImport(sourceRoot, sourceFilePath, importPath) {
  if (importPath.startsWith('@/')) {
    return detectLayer(path.join(sourceRoot, importPath.slice(2)), sourceRoot)
  }

  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    const resolved = path.resolve(path.dirname(sourceFilePath), importPath)
    return detectLayer(resolved, sourceRoot)
  }

  return undefined
}

async function runCli() {
  const report = await checkLayerBoundaries()
  if (report.violations.length === 0) {
    // eslint-disable-next-line no-console
    console.info('[layer-boundaries] no violations')
    return
  }

  for (const violation of report.violations) {
    // eslint-disable-next-line no-console
    console.error(
      `[layer-boundaries] ${violation.rule} source=${violation.sourceLayer} target=${violation.targetLayer} file=${violation.filePath} import=${violation.importPath}`
    )
  }
  process.exitCode = 1
}

const invokedAsScript =
  typeof process.argv[1] === 'string' &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))

if (invokedAsScript) {
  void runCli()
}
