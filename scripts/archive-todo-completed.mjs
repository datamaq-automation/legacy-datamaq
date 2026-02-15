import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const TODO_PATH = 'docs/todo.md'
const DONE_PREFIX = 'docs/todo.done.'
const DONE_SUFFIX = '.md'
const TASK_HEADER_PATTERN = /^- \[(?: |>|x)\] \(P[0-2]\) /
const DONE_TASK_PATTERN = /^- \[x\] \(P[0-2]\) /

const args = process.argv.slice(2)
const CHECK_ONLY = args.includes('--check')
const DRY_RUN = args.includes('--dry-run')
const DATE_ARG = readArg('--date')

function readArg(flag) {
  const flagIndex = args.indexOf(flag)
  if (flagIndex === -1) {
    return null
  }
  const value = args[flagIndex + 1]
  return value && !value.startsWith('--') ? value : null
}

function pad(number) {
  return String(number).padStart(2, '0')
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
  return {
    dateLabel,
    monthLabel,
    timestamp
  }
}

function readFile(path) {
  try {
    return readFileSync(path, 'utf8')
  } catch (error) {
    const message = error?.message || 'read failed'
    throw new Error(`No se pudo leer ${path}: ${message}`)
  }
}

function collectDoneTaskBlocks(todoContent) {
  const lines = todoContent.split(/\r?\n/)
  const removedIndices = new Set()
  const blocks = []

  for (let index = 0; index < lines.length; index += 1) {
    if (!DONE_TASK_PATTERN.test(lines[index])) {
      continue
    }

    const start = index
    const blockLines = [lines[index]]
    index += 1

    while (index < lines.length && !TASK_HEADER_PATTERN.test(lines[index])) {
      blockLines.push(lines[index])
      index += 1
    }

    const end = index - 1
    for (let cursor = start; cursor <= end; cursor += 1) {
      removedIndices.add(cursor)
    }

    blocks.push(blockLines.join('\n').trimEnd())
    index -= 1
  }

  return {
    blocks,
    remainingTodoLines: lines.filter((_, index) => !removedIndices.has(index))
  }
}

function normalizeTodoContent(lines) {
  const compact = lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()
  return compact.length > 0 ? `${compact}\n` : ''
}

function getDonePath(monthLabel) {
  return `${DONE_PREFIX}${monthLabel}${DONE_SUFFIX}`
}

function buildDoneSection(blocks, timestamp) {
  return [
    `## Movido desde docs/todo.md el ${timestamp}`,
    '',
    `### Tareas movidas (${blocks.length})`,
    '',
    blocks.join('\n\n'),
    ''
  ].join('\n')
}

function buildDoneFileContent(donePath, monthLabel, sectionContent) {
  const hasDoneFile = existsSync(donePath)
  if (!hasDoneFile) {
    return [
      `# Tareas Completadas (${monthLabel})`,
      '',
      'Extraccion automatica desde `docs/todo.md`.',
      '',
      sectionContent
    ].join('\n')
  }

  const current = readFile(donePath).trimEnd()
  return `${current}\n\n${sectionContent}`
}

function getBlockTitles(blocks) {
  return blocks.map((block) => block.split(/\r?\n/)[0].trim())
}

function run() {
  const { monthLabel, timestamp } = getDateParts()
  const donePath = getDonePath(monthLabel)
  const todoContent = readFile(TODO_PATH)
  const { blocks, remainingTodoLines } = collectDoneTaskBlocks(todoContent)

  if (CHECK_ONLY) {
    if (blocks.length === 0) {
      console.log('[todo-archive] OK: docs/todo.md no tiene tareas cerradas pendientes de archivo.')
      return
    }
    console.error(
      `[todo-archive] ERROR: docs/todo.md tiene ${blocks.length} tarea(s) cerrada(s). Ejecuta: npm run todo:archive`
    )
    for (const title of getBlockTitles(blocks)) {
      console.error(`- ${title}`)
    }
    process.exit(1)
  }

  if (blocks.length === 0) {
    console.log('[todo-archive] Sin cambios: no hay tareas cerradas para mover desde docs/todo.md.')
    return
  }

  if (DRY_RUN) {
    console.log(`[todo-archive] DRY RUN: se moverian ${blocks.length} tarea(s) a ${donePath}.`)
    for (const title of getBlockTitles(blocks)) {
      console.log(`- ${title}`)
    }
    return
  }

  const nextTodo = normalizeTodoContent(remainingTodoLines)
  const doneSection = buildDoneSection(blocks, timestamp)
  const nextDone = buildDoneFileContent(donePath, monthLabel, doneSection)

  writeFileSync(TODO_PATH, nextTodo, 'utf8')
  writeFileSync(donePath, nextDone, 'utf8')

  console.log(`[todo-archive] OK: ${blocks.length} tarea(s) movida(s) desde ${TODO_PATH} hacia ${donePath}.`)
}

run()
