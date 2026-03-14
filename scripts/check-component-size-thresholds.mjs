import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const checks = [
  { file: 'src/ui/pages/HomePage.vue', maxLines: 1300 },
  { file: 'src/ui/features/contact/ContactFormSection.vue', maxLines: 750 }
]

function countLines(content) {
  if (!content) {
    return 0
  }
  return content.split(/\r?\n/).length
}

async function getLineCount(filePath) {
  const fullPath = resolve(process.cwd(), filePath)
  const content = await readFile(fullPath, 'utf8')
  return countLines(content)
}

async function main() {
  let hasViolations = false

  for (const check of checks) {
    const lines = await getLineCount(check.file)
    if (lines > check.maxLines) {
      hasViolations = true
      console.error(
        `[component-size] threshold exceeded: ${check.file} has ${lines} lines (max ${check.maxLines})`
      )
    } else {
      console.log(
        `[component-size] ok: ${check.file} has ${lines} lines (max ${check.maxLines})`
      )
    }
  }

  if (hasViolations) {
    process.exitCode = 1
    return
  }

  console.log('[component-size] all thresholds satisfied')
}

main().catch((error) => {
  console.error('[component-size] check failed', error)
  process.exitCode = 1
})
