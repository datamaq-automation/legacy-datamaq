import { readFile, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const assetsDir = join(process.cwd(), 'dist', 'assets')
const budgetPath = join(process.cwd(), 'scripts', 'css-budget.json')

let budget
try {
  const raw = await readFile(budgetPath, 'utf-8')
  budget = JSON.parse(raw)
} catch (error) {
  console.error('Missing or invalid budget file at scripts/css-budget.json.')
  process.exit(1)
}

if (!Number.isFinite(budget.maxBytes)) {
  console.error('Budget file must include numeric maxBytes.')
  process.exit(1)
}

let files
try {
  files = await readdir(assetsDir)
} catch (error) {
  console.error('dist/assets not found. Run `npm run build` first.')
  process.exit(1)
}

const cssFiles = files.filter((file) => file.endsWith('.css'))
if (cssFiles.length === 0) {
  console.log('No CSS files found in dist/assets.')
  process.exit(0)
}

const entries = await Promise.all(
  cssFiles.map(async (file) => {
    const filePath = join(assetsDir, file)
    const { size } = await stat(filePath)
    return { file, size }
  })
)

const total = entries.reduce((sum, entry) => sum + entry.size, 0)
if (total > budget.maxBytes) {
  console.error(`CSS budget exceeded: ${total} bytes > ${budget.maxBytes} bytes.`)
  process.exit(1)
}

console.log(`CSS budget ok: ${total} bytes <= ${budget.maxBytes} bytes.`)
