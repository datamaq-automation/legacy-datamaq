import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const TODO_PATH = 'docs/todo.md'
const DONE_PREFIX = 'docs/todo.done.'
const DONE_SUFFIX = '.md'

const TASK_HEADER_PATTERN = /^- \[(?: |>|x)\] \(P[0-2]\) /
const OPEN_TASK_PATTERN = /^- \[(?: |>)\] \(P[0-2]\) (.+)$/

const EVIDENCE_PATTERN = /^ {2}- Evidencia:/
const AVANCE_PATTERN = /^ {2}- Avance:/
const MITIGACION_PATTERN = /^ {2}- Mitigacion interna ejecutada:/

const EVIDENCE_KEEP_HEAD = 3
const EVIDENCE_KEEP_TAIL = 4
const AVANCE_KEEP_HEAD = 1
const AVANCE_KEEP_TAIL = 2
const MITIGACION_KEEP_HEAD = 1
const MITIGACION_KEEP_TAIL = 2

const args = process.argv.slice(2)
const CHECK_ONLY = args.includes('--check')
const DRY_RUN = args.includes('--dry-run')
const DATE_ARG = readArg('--date')

function readArg(flag) {
  const index = args.indexOf(flag)
  if (index === -1) {
    return null
  }
  const value = args[index + 1]
  return value && !value.startsWith('--') ? value : null
}

function pad(value) {
  return String(value).padStart(2, '0')
}

function formatOffset(date) {
  const minutes = -date.getTimezoneOffset()
  const sign = minutes >= 0 ? '+' : '-'
  const absolute = Math.abs(minutes)
  return `${sign}${pad(Math.floor(absolute / 60))}:${pad(absolute % 60)}`
}

function getDateParts() {
  const now = new Date()
  const dateLabel = DATE_ARG || `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const monthLabel = dateLabel.slice(0, 7)
  const timestamp = `${dateLabel} ${pad(now.getHours())}:${pad(now.getMinutes())} ${formatOffset(now)}`
  return { monthLabel, timestamp }
}

function readFile(path) {
  try {
    return readFileSync(path, 'utf8')
  } catch (error) {
    const message = error?.message || 'read failed'
    throw new Error(`No se pudo leer ${path}: ${message}`)
  }
}

function getDonePath(monthLabel) {
  return `${DONE_PREFIX}${monthLabel}${DONE_SUFFIX}`
}

function collectOpenTaskRanges(lines) {
  const ranges = []

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(OPEN_TASK_PATTERN)
    if (!match) {
      continue
    }

    const start = index
    let end = lines.length - 1
    let cursor = index + 1

    while (cursor < lines.length) {
      if (TASK_HEADER_PATTERN.test(lines[cursor])) {
        end = cursor - 1
        break
      }
      cursor += 1
    }

    ranges.push({
      title: match[1].trim(),
      start,
      end
    })
  }

  return ranges
}

function selectIndicesByPattern(lines, pattern, keepHead, keepTail) {
  const matches = []

  for (let index = 0; index < lines.length; index += 1) {
    if (pattern.test(lines[index])) {
      matches.push(index)
    }
  }

  if (matches.length <= keepHead + keepTail) {
    return []
  }

  const removable = []
  const start = keepHead
  const end = matches.length - keepTail

  for (let index = start; index < end; index += 1) {
    removable.push(matches[index])
  }

  return removable
}

function collectNoiseRemovals(lines) {
  const ranges = collectOpenTaskRanges(lines)
  const removeByGlobalIndex = new Map()
  const removedByTask = new Map()

  for (const range of ranges) {
    const blockLines = lines.slice(range.start, range.end + 1)
    const localRemovals = new Set()

    for (const localIndex of selectIndicesByPattern(
      blockLines,
      EVIDENCE_PATTERN,
      EVIDENCE_KEEP_HEAD,
      EVIDENCE_KEEP_TAIL
    )) {
      localRemovals.add(localIndex)
    }

    for (const localIndex of selectIndicesByPattern(
      blockLines,
      AVANCE_PATTERN,
      AVANCE_KEEP_HEAD,
      AVANCE_KEEP_TAIL
    )) {
      localRemovals.add(localIndex)
    }

    for (const localIndex of selectIndicesByPattern(
      blockLines,
      MITIGACION_PATTERN,
      MITIGACION_KEEP_HEAD,
      MITIGACION_KEEP_TAIL
    )) {
      localRemovals.add(localIndex)
    }

    if (localRemovals.size === 0) {
      continue
    }

    const orderedLocalRemovals = Array.from(localRemovals).sort((left, right) => left - right)
    const removedLines = []

    for (const localIndex of orderedLocalRemovals) {
      const globalIndex = range.start + localIndex
      const line = lines[globalIndex]
      removeByGlobalIndex.set(globalIndex, line)
      removedLines.push(line)
    }

    removedByTask.set(range.title, removedLines)
  }

  return { removeByGlobalIndex, removedByTask }
}

function buildUpdatedTodo(lines, removeByGlobalIndex) {
  const next = lines.filter((_, index) => !removeByGlobalIndex.has(index))
  const compact = next.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()
  return `${compact}\n`
}

function buildNoiseSection(timestamp, removedByTask) {
  const taskTitles = Array.from(removedByTask.keys())
  const movedLines = taskTitles.reduce((count, title) => count + removedByTask.get(title).length, 0)
  const sectionLines = [
    `## Ruido operativo movido desde docs/todo.md el ${timestamp}`,
    '',
    '### Resumen',
    `- Tareas afectadas: ${taskTitles.length}`,
    `- Lineas movidas: ${movedLines}`,
    ''
  ]

  for (const title of taskTitles) {
    sectionLines.push(`### ${title}`)
    for (const line of removedByTask.get(title)) {
      sectionLines.push(line)
    }
    sectionLines.push('')
  }

  return sectionLines.join('\n').trimEnd()
}

function buildDoneContent(donePath, monthLabel, section) {
  if (!existsSync(donePath)) {
    return [
      `# Tareas Completadas (${monthLabel})`,
      '',
      'Extraccion automatica desde `docs/todo.md`.',
      '',
      section
    ].join('\n')
  }

  const current = readFile(donePath).trimEnd()
  return `${current}\n\n${section}`
}

function reportRemovals(removedByTask) {
  const taskTitles = Array.from(removedByTask.keys())
  const movedLines = taskTitles.reduce((count, title) => count + removedByTask.get(title).length, 0)
  return { taskTitles, movedLines }
}

function run() {
  const todoContent = readFile(TODO_PATH)
  const lines = todoContent.split(/\r?\n/)
  const { removeByGlobalIndex, removedByTask } = collectNoiseRemovals(lines)
  const { taskTitles, movedLines } = reportRemovals(removedByTask)

  if (CHECK_ONLY) {
    if (movedLines === 0) {
      console.log('[todo-compact] OK: docs/todo.md no tiene ruido operativo compactable.')
      return
    }
    console.error(
      `[todo-compact] ERROR: se detecto ruido operativo compactable (${movedLines} lineas en ${taskTitles.length} tarea(s)).`
    )
    console.error('[todo-compact] Ejecuta `npm run todo:compact:noise` para mover historial repetitivo.')
    for (const title of taskTitles) {
      console.error(`- ${title}`)
    }
    process.exit(1)
  }

  if (movedLines === 0) {
    console.log('[todo-compact] Sin cambios: no hay ruido operativo para mover.')
    return
  }

  const { monthLabel, timestamp } = getDateParts()
  const donePath = getDonePath(monthLabel)

  if (DRY_RUN) {
    console.log(
      `[todo-compact] DRY RUN: se moverian ${movedLines} lineas de ruido operativo en ${taskTitles.length} tarea(s) a ${donePath}.`
    )
    for (const title of taskTitles) {
      console.log(`- ${title}`)
    }
    return
  }

  const nextTodo = buildUpdatedTodo(lines, removeByGlobalIndex)
  const section = buildNoiseSection(timestamp, removedByTask)
  const nextDone = buildDoneContent(donePath, monthLabel, section)

  writeFileSync(TODO_PATH, nextTodo, 'utf8')
  writeFileSync(donePath, nextDone, 'utf8')

  console.log(
    `[todo-compact] OK: ${movedLines} lineas movidas desde ${TODO_PATH} hacia ${donePath} en ${taskTitles.length} tarea(s).`
  )
}

run()
