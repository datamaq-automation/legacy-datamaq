import { execFileSync } from 'node:child_process'

const TODO_PATH = 'docs/todo.md'
const TRACKED_SCOPES = ['src/', 'tests/']
const DIFF_FILTER = 'ACDMR'
const REQUIRE_EVIDENCE =
  process.argv.includes('--require-evidence') || process.env.TODO_SYNC_REQUIRE_EVIDENCE === '1'
const envRange = process.env.TODO_COMPLIANCE_DIFF?.trim()
const EVIDENCE_PATTERNS = [
  /\bEvidencia:\b/i,
  /\bAvance:\b/i,
  /\bDecision tomada \([ABC]\):\b/i,
  /\bBloqueador residual:\b/i,
  /\bSiguiente paso:\b/i,
  /\bClasificacion [ABC] aplicada en:\b/i
]

function runGit(args) {
  try {
    return execFileSync('git', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    }).trim()
  } catch (error) {
    const stderr = error?.stderr?.toString?.().trim?.()
    const message = stderr || error?.message || 'git command failed'
    throw new Error(message)
  }
}

function splitLines(value) {
  if (!value) {
    return []
  }
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

function safeRun(args) {
  try {
    return runGit(args)
  } catch {
    return ''
  }
}

function resolveCiRange() {
  if (envRange) {
    return envRange
  }

  const baseRef = process.env.GITHUB_BASE_REF?.trim()
  if (baseRef) {
    const originRef = `origin/${baseRef}`
    const hasOriginRef = Boolean(safeRun(['rev-parse', '--verify', originRef]))
    if (hasOriginRef) {
      return `${originRef}...HEAD`
    }

    const hasLocalRef = Boolean(safeRun(['rev-parse', '--verify', baseRef]))
    if (hasLocalRef) {
      return `${baseRef}...HEAD`
    }
  }

  if (process.env.GITHUB_EVENT_NAME === 'push') {
    const hasHeadParent = Boolean(safeRun(['rev-parse', '--verify', 'HEAD~1']))
    if (hasHeadParent) {
      return 'HEAD~1...HEAD'
    }
    return 'HEAD'
  }

  return null
}

function listChangedFilesByRange(range) {
  if (range === 'HEAD') {
    return splitLines(runGit(['show', '--pretty=', '--name-only', `--diff-filter=${DIFF_FILTER}`, 'HEAD']))
  }

  return splitLines(runGit(['diff', '--name-only', `--diff-filter=${DIFF_FILTER}`, range, '--']))
}

function listLocalChangedFiles() {
  const tracked = splitLines(runGit(['diff', '--name-only', `--diff-filter=${DIFF_FILTER}`, 'HEAD', '--']))
  const untracked = splitLines(runGit(['ls-files', '--others', '--exclude-standard']))
  return Array.from(new Set([...tracked, ...untracked]))
}

function hasTrackedScopeChanges(files) {
  return files.some((file) => TRACKED_SCOPES.some((scope) => file.startsWith(scope)))
}

function getTodoAddedLines(ciRange) {
  const args = ciRange
    ? ciRange === 'HEAD'
      ? ['show', '--pretty=', '--unified=0', 'HEAD', '--', TODO_PATH]
      : ['diff', '--unified=0', ciRange, '--', TODO_PATH]
    : ['diff', '--unified=0', 'HEAD', '--', TODO_PATH]

  const output = safeRun(args)
  if (!output) {
    return []
  }

  return output
    .split(/\r?\n/)
    .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
    .map((line) => line.slice(1).trim())
    .filter(Boolean)
}

function containsEvidenceLine(lines) {
  return lines.some((line) => EVIDENCE_PATTERNS.some((pattern) => pattern.test(line)))
}

function main() {
  const ciRange = resolveCiRange()
  const files = ciRange ? listChangedFilesByRange(ciRange) : listLocalChangedFiles()
  const hasCodeChanges = hasTrackedScopeChanges(files)
  const hasTodoUpdate = files.includes(TODO_PATH)

  if (!hasCodeChanges) {
    console.log('[todo-sync] OK: no hay cambios en src/ o tests/.')
    return
  }

  if (hasTodoUpdate) {
    if (!REQUIRE_EVIDENCE) {
      console.log('[todo-sync] OK: src/tests cambiaron y docs/todo.md tambien.')
      return
    }

    const todoAddedLines = getTodoAddedLines(ciRange)
    if (!containsEvidenceLine(todoAddedLines)) {
      console.error(
        '[todo-sync] ERROR: docs/todo.md cambio, pero no se detecta trazabilidad minima (Evidencia/Avance/Decision/Bloqueador/Siguiente paso/Clasificacion).'
      )
      console.error('[todo-sync] Agrega al menos una linea explicita de trazabilidad en docs/todo.md.')
      process.exit(1)
    }

    console.log('[todo-sync] OK: src/tests cambiaron, docs/todo.md se actualizo y contiene trazabilidad.')
    return
  }

  const changedCodeFiles = files.filter((file) =>
    TRACKED_SCOPES.some((scope) => file.startsWith(scope))
  )

  console.error('[todo-sync] ERROR: hay cambios en src/ o tests/ sin actualizar docs/todo.md.')
  console.error(`[todo-sync] Scope requerido: ${TRACKED_SCOPES.join(', ')}`)
  if (ciRange) {
    console.error(`[todo-sync] Rango evaluado: ${ciRange}`)
  } else {
    console.error('[todo-sync] Modo local: HEAD + untracked')
  }
  console.error('[todo-sync] Archivos detectados:')
  for (const file of changedCodeFiles) {
    console.error(`- ${file}`)
  }
  process.exit(1)
}

main()
