import { readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const DIST_DIR = path.join(process.cwd(), 'dist')

function collectCss(dir) {
  const rows = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      rows.push(...collectCss(full))
      continue
    }
    if (/\.css$/i.test(entry)) {
      rows.push({ file: full, bytes: stat.size })
    }
  }
  return rows
}

const rows = collectCss(DIST_DIR)
let total = 0
for (const row of rows) {
  total += row.bytes
  console.log(`[css-report] ${row.file} ${(row.bytes / 1024).toFixed(2)}KB`)
}
console.log(`[css-report] total ${(total / 1024).toFixed(2)}KB`)
