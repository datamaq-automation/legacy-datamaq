import { readdir, readFile } from 'node:fs/promises'
import { resolve, extname } from 'node:path'

const USE_CASES_DIR = resolve(process.cwd(), 'src/application/use-cases')
const MAX_DEPENDENCIES = 10

function extractConstructorParams(content) {
  const constructorMatch = content.match(/constructor\s*\(([\s\S]*?)\)\s*\{/)
  if (!constructorMatch) {
    return []
  }

  const raw = constructorMatch[1].trim()
  if (!raw) {
    return []
  }

  return raw
    .split(',')
    .map((param) => param.trim())
    .filter(Boolean)
}

async function collectUseCaseFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectUseCaseFiles(fullPath)))
      continue
    }
    if (entry.isFile() && extname(entry.name) === '.ts') {
      files.push(fullPath)
    }
  }
  return files
}

function toRel(path) {
  return path.replace(process.cwd(), '.').replace(/\\/g, '/')
}

async function main() {
  const files = await collectUseCaseFiles(USE_CASES_DIR)
  let hasViolations = false

  for (const file of files) {
    const content = await readFile(file, 'utf8')
    const params = extractConstructorParams(content)
    const count = params.length
    const rel = toRel(file)

    if (count === 0) {
      console.log(`[usecase-deps] info: ${rel} has no constructor dependencies`)
      continue
    }

    if (count > MAX_DEPENDENCIES) {
      hasViolations = true
      console.error(
        `[usecase-deps] threshold exceeded: ${rel} has ${count} constructor dependencies (max ${MAX_DEPENDENCIES})`
      )
      continue
    }

    console.log(`[usecase-deps] ok: ${rel} has ${count} constructor dependencies (max ${MAX_DEPENDENCIES})`)
  }

  if (hasViolations) {
    process.exitCode = 1
    return
  }

  console.log('[usecase-deps] all use-case constructor thresholds satisfied')
}

main().catch((error) => {
  console.error('[usecase-deps] check failed', error)
  process.exitCode = 1
})
