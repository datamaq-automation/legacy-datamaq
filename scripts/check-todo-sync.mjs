import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const TODO_PATH = 'docs/todo.md'
const TRACKED_SCOPES = ['src/', 'tests/']
const DIFF_FILTER = 'ACDMR'
const REQUIRE_EVIDENCE =
  process.argv.includes('--require-evidence') || process.env.TODO_SYNC_REQUIRE_EVIDENCE === '1'
const REQUIRE_OPEN_P0 =
  process.argv.includes('--require-open-p0') || process.env.TODO_SYNC_REQUIRE_OPEN_P0 === '1'
const envRange = process.env.TODO_COMPLIANCE_DIFF?.trim()
const EVIDENCE_PATTERNS = [
  /\bEvidencia:/i,
  /\bAvance:/i,
  /\bDecision tomada \([ABC]\):/i,
  /\bBloqueador residual:/i,
  /\bSiguiente paso:/i,
  /\bClasificacion [ABC] aplicada en:/i
]
const OPEN_P0_TASK_PATTERN = /^- \[(?: |>)\] \(P0\) (.+)$/
const TASK_HEADER_PATTERN = /^- \[(?: |>)\] \(P[0-2]\) /

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

function readTodoContent() {
  try {
    return readFileSync(TODO_PATH, 'utf8')
  } catch (error) {
    const message = error?.message || 'read failed'
    throw new Error(`[todo-sync] ERROR: no se pudo leer ${TODO_PATH}: ${message}`)
  }
}

function extractOpenP0Tasks(todoContent) {
  const lines = todoContent.split(/\r?\n/)
  const tasks = []

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const match = line.match(OPEN_P0_TASK_PATTERN)
    if (!match) {
      continue
    }

    const block = [line]
    let cursor = index + 1
    while (cursor < lines.length && !TASK_HEADER_PATTERN.test(lines[cursor])) {
      block.push(lines[cursor])
      cursor += 1
    }

    tasks.push({
      title: match[1].trim(),
      line: index + 1,
      block: block.join('\n')
    })

    index = cursor - 1
  }

  return tasks
}

function validateOpenP0Tasks(todoContent) {
  const tasks = extractOpenP0Tasks(todoContent)
  const issues = []

  for (const task of tasks) {
    if (!/\bSiguiente accion interna ejecutable ahora:/i.test(task.block)) {
      issues.push(
        `${TODO_PATH}:${task.line} "${task.title}" no declara "Siguiente accion interna ejecutable ahora: ...".`
      )
    }

    const hasDecisionC = /\bDecision tomada \(C\):/i.test(task.block)
    const typeMatch = task.block.match(/\bTipo C:\s*(C1|C2)\b/i)

    if (hasDecisionC && !typeMatch) {
      issues.push(
        `${TODO_PATH}:${task.line} "${task.title}" incluye Decision tomada (C) sin "Tipo C: C1|C2".`
      )
    }

    if (
      typeMatch &&
      typeMatch[1].toUpperCase() === 'C1' &&
      !/\bPregunta cerrada pendiente \(solo C1\):/i.test(task.block)
    ) {
      issues.push(
        `${TODO_PATH}:${task.line} "${task.title}" marca "Tipo C: C1" sin "Pregunta cerrada pendiente (solo C1): ...".`
      )
    }
  }

  return issues
}

function ensureOpenP0Compliance() {
  if (!REQUIRE_OPEN_P0) {
    return
  }

  const todoContent = readTodoContent()
  const issues = validateOpenP0Tasks(todoContent)

  if (issues.length === 0) {
    console.log('[todo-sync] OK: tareas P0 abiertas con trazabilidad operativa minima.')
    return
  }

  console.error('[todo-sync] ERROR: incumplimiento de trazabilidad en tareas P0 abiertas.')
  for (const issue of issues) {
    console.error(`- ${issue}`)
  }
  process.exit(1)
}

function main() {
  ensureOpenP0Compliance()

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
