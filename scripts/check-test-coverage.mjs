import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const COVERAGE_SUMMARY_PATH = path.join(process.cwd(), 'coverage', 'coverage-summary.json')
const MIN_LINES = Number(process.env.COVERAGE_MIN_LINES ?? 0)
const MIN_BRANCHES = Number(process.env.COVERAGE_MIN_BRANCHES ?? 0)
const MIN_FUNCTIONS = Number(process.env.COVERAGE_MIN_FUNCTIONS ?? 0)
const MIN_STATEMENTS = Number(process.env.COVERAGE_MIN_STATEMENTS ?? 0)

if (!existsSync(COVERAGE_SUMMARY_PATH)) {
  console.error(`[coverage] missing file: ${COVERAGE_SUMMARY_PATH}`)
  process.exit(1)
}

const raw = readFileSync(COVERAGE_SUMMARY_PATH, 'utf8')
const summary = JSON.parse(raw)
const total = summary?.total

if (!total) {
  console.error('[coverage] invalid summary format: missing total')
  process.exit(1)
}

const metrics = {
  lines: Number(total.lines?.pct ?? 0),
  branches: Number(total.branches?.pct ?? 0),
  functions: Number(total.functions?.pct ?? 0),
  statements: Number(total.statements?.pct ?? 0)
}

const failures = []
if (metrics.lines < MIN_LINES) failures.push(`lines ${metrics.lines}% < ${MIN_LINES}%`)
if (metrics.branches < MIN_BRANCHES) failures.push(`branches ${metrics.branches}% < ${MIN_BRANCHES}%`)
if (metrics.functions < MIN_FUNCTIONS) failures.push(`functions ${metrics.functions}% < ${MIN_FUNCTIONS}%`)
if (metrics.statements < MIN_STATEMENTS) failures.push(`statements ${metrics.statements}% < ${MIN_STATEMENTS}%`)

console.log(
  `[coverage] lines=${metrics.lines}% branches=${metrics.branches}% functions=${metrics.functions}% statements=${metrics.statements}%`
)

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`[coverage] threshold failed: ${failure}`)
  }
  process.exit(1)
}

console.log('[coverage] thresholds passed')
