import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT_DIR = process.cwd()
const SRC_DIR = path.resolve(ROOT_DIR, 'src')
const FILE_PATTERN = /\.(ts|tsx|js|jsx|vue|scss|css|json)$/

const ALLOWED_FILES = new Set([
  normalizePath('src/infrastructure/config/publicConfig.ts'),
  normalizePath('src/infrastructure/content/Appcontent.active.ts'),
  normalizePath('src/infrastructure/content/Appcontent.datamaq.ts'),
  normalizePath('src/infrastructure/content/runtimeProfile.ts'),
  normalizePath('src/infrastructure/content/runtimeProfiles.json'),
  normalizePath('src/application/consent/consentStorage.ts'),
  normalizePath('src/infrastructure/attribution/utm.ts')
])

const FORBIDDEN_PATTERNS = [
  /datamaq/i,
  /www\.datamaq\.com\.ar/i,
  /contacto@datamaq\.com\.ar/i,
  /wa\.me\/5491156297160/i
]

async function main() {
  const files = await collectFiles(SRC_DIR)
  const violations = []

  for (const absolutePath of files) {
    const normalizedFilePath = normalizePath(path.relative(ROOT_DIR, absolutePath))
    if (ALLOWED_FILES.has(normalizedFilePath)) {
      continue
    }

    const content = await fs.readFile(absolutePath, 'utf8')
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (!pattern.test(content)) {
        continue
      }
      violations.push({
        file: normalizedFilePath,
        pattern: pattern.toString()
      })
      break
    }
  }

  if (violations.length > 0) {
    // eslint-disable-next-line no-console
    console.error('[brand-hardcodes] detected forbidden brand literals outside allowed config files:')
    for (const violation of violations) {
      // eslint-disable-next-line no-console
      console.error(`- ${violation.file} (matched ${violation.pattern})`)
    }
    process.exit(1)
  }

  // eslint-disable-next-line no-console
  console.info('[brand-hardcodes] no forbidden hardcoded literals found')
}

async function collectFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true }).catch(() => [])
  const files = []

  for (const entry of entries) {
    const absolutePath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(absolutePath)))
      continue
    }
    if (FILE_PATTERN.test(entry.name)) {
      files.push(absolutePath)
    }
  }

  return files
}

function normalizePath(value) {
  return value.replace(/\\/g, '/')
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('[brand-hardcodes] unexpected error', error)
  process.exit(1)
})
