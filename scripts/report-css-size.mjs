import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const assetsDir = join(process.cwd(), 'dist', 'assets')

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

entries.sort((a, b) => b.size - a.size)

let total = 0
for (const entry of entries) {
  total += entry.size
  const kb = (entry.size / 1024).toFixed(1)
  console.log(`${entry.file}  ${entry.size} bytes  (${kb} KB)`)
}

const totalKb = (total / 1024).toFixed(1)
console.log(`TOTAL  ${total} bytes  (${totalKb} KB)`)
