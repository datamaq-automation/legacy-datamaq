import fs from 'node:fs/promises'
import path from 'node:path'

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.vue'])

const DISALLOWED_IMPORT_RULES = {
  domain: new Set(['application', 'infrastructure', 'ui']),
  application: new Set(['infrastructure', 'ui']),
  infrastructure: new Set(['ui']),
  ui: new Set(['infrastructure'])
}

const RULE_NAMES = {
  domain: 'domain-no-outbound-to-application-infrastructure-ui',
  application: 'application-no-outbound-to-infrastructure-ui',
  infrastructure: 'infrastructure-no-outbound-to-ui',
  ui: 'ui-no-outbound-to-infrastructure'
}

function normalizePath(value) {
  return value.replaceAll('\\', '/')
}

function resolveLayerFromSourceFile(sourceFilePath, srcRoot) {
  const rel = normalizePath(path.relative(srcRoot, sourceFilePath))
  if (rel.startsWith('domain/')) return 'domain'
  if (rel.startsWith('application/')) return 'application'
  if (rel.startsWith('infrastructure/')) return 'infrastructure'
  if (rel.startsWith('ui/')) return 'ui'
  return null
}

function resolveLayerFromSpecifier(specifier, sourceFilePath, srcRoot) {
  if (specifier.startsWith('@/domain/')) return 'domain'
  if (specifier.startsWith('@/application/')) return 'application'
  if (specifier.startsWith('@/infrastructure/')) return 'infrastructure'
  if (specifier.startsWith('@/ui/')) return 'ui'

  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    const resolvedPath = path.resolve(path.dirname(sourceFilePath), specifier)
    return resolveLayerFromSourceFile(resolvedPath, srcRoot)
  }

  return null
}

function extractImportSpecifiers(fileContent) {
  const imports = []
  const fromPattern = /\bfrom\s*['"]([^'"]+)['"]/g
  const dynamicImportPattern = /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g

  for (const match of fileContent.matchAll(fromPattern)) {
    if (typeof match.index !== 'number') continue
    imports.push({ specifier: match[1], index: match.index })
  }

  for (const match of fileContent.matchAll(dynamicImportPattern)) {
    if (typeof match.index !== 'number') continue
    imports.push({ specifier: match[1], index: match.index })
  }

  return imports
}

function getLineNumber(fileContent, index) {
  return fileContent.slice(0, index).split('\n').length
}

async function collectSourceFiles(dirPath, output = []) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      await collectSourceFiles(fullPath, output)
      continue
    }

    if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      output.push(fullPath)
    }
  }

  return output
}

export async function checkLayerBoundaries({ rootDir = process.cwd() } = {}) {
  const srcRoot = path.join(rootDir, 'src')
  const violations = []

  const srcExists = await fs
    .access(srcRoot)
    .then(() => true)
    .catch(() => false)

  if (!srcExists) {
    return { violations }
  }

  const sourceFiles = await collectSourceFiles(srcRoot)
  for (const sourceFilePath of sourceFiles) {
    const sourceLayer = resolveLayerFromSourceFile(sourceFilePath, srcRoot)
    if (!sourceLayer) continue

    const disallowedTargets = DISALLOWED_IMPORT_RULES[sourceLayer]
    if (!disallowedTargets) continue

    const fileContent = await fs.readFile(sourceFilePath, 'utf8')
    const imports = extractImportSpecifiers(fileContent)

    for (const item of imports) {
      const targetLayer = resolveLayerFromSpecifier(item.specifier, sourceFilePath, srcRoot)
      if (!targetLayer || !disallowedTargets.has(targetLayer)) continue

      violations.push({
        file: normalizePath(path.relative(rootDir, sourceFilePath)),
        line: getLineNumber(fileContent, item.index),
        sourceLayer,
        targetLayer,
        specifier: item.specifier,
        rule: RULE_NAMES[sourceLayer]
      })
    }
  }

  return { violations }
}
