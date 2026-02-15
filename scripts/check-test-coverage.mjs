import { readFile } from 'node:fs/promises'

const COVERAGE_SUMMARY_PATH = 'coverage/coverage-summary.json'
const THRESHOLDS_PATH = 'scripts/test-coverage-thresholds.json'
const METRICS = ['lines', 'statements', 'functions', 'branches']

async function readJson(path) {
  try {
    const raw = await readFile(path, 'utf8')
    return JSON.parse(raw)
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    throw new Error(`No se pudo leer ${path}: ${detail}`)
  }
}

function formatPct(value) {
  return Number(value).toFixed(2)
}

async function main() {
  const thresholds = await readJson(THRESHOLDS_PATH)
  const summary = await readJson(COVERAGE_SUMMARY_PATH)

  const total = summary?.total
  if (!total || typeof total !== 'object') {
    console.error('[test-coverage] ERROR: coverage summary sin bloque "total".')
    process.exit(1)
  }

  const failures = []
  for (const metric of METRICS) {
    const required = Number(thresholds?.[metric])
    const actual = Number(total?.[metric]?.pct)

    if (!Number.isFinite(required)) {
      failures.push(
        `threshold invalido para "${metric}" en ${THRESHOLDS_PATH}`
      )
      continue
    }

    if (!Number.isFinite(actual)) {
      failures.push(`coverage invalida para "${metric}" en ${COVERAGE_SUMMARY_PATH}`)
      continue
    }

    if (actual < required) {
      failures.push(
        `${metric}: ${formatPct(actual)}% < ${formatPct(required)}%`
      )
    }
  }

  if (failures.length > 0) {
    console.error('[test-coverage] ERROR: umbral de cobertura no cumplido.')
    for (const failure of failures) {
      console.error(`- ${failure}`)
    }
    process.exit(1)
  }

  console.log(
    `[test-coverage] OK: lines=${formatPct(total.lines.pct)} statements=${formatPct(total.statements.pct)} functions=${formatPct(total.functions.pct)} branches=${formatPct(total.branches.pct)}`
  )
}

await main()
