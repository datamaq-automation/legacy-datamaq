import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'

const TODO_PATH = path.join(process.cwd(), 'docs', 'todo.md')
const TODO_DONE_PATH = path.join(process.cwd(), 'docs', 'todo.done.md')

const args = new Set(process.argv.slice(2))

function fail(message) {
  console.error(`[todo-sync] ${message}`)
  process.exit(1)
}

function info(message) {
  console.log(`[todo-sync] ${message}`)
}

function readUtf8(filePath) {
  if (!existsSync(filePath)) {
    fail(`missing file: ${filePath}`)
  }
  return readFileSync(filePath, 'utf8')
}

const todo = readUtf8(TODO_PATH)
const done = readUtf8(TODO_DONE_PATH)

const hasPendingTask = /-\s\[\s\]\s.+/m.test(todo)
const hasPartialTask = /-\s\[\/\]\s.+/m.test(todo)
const hasAnyOpenTask = hasPendingTask || hasPartialTask

const hasP0Section = /^###\s+0\./m.test(todo)
const hasDoneMarkersInTodo = /\bCompletado:\b/i.test(todo)
const hasAnyEvidenceLink = /`[^`]+`|\[[^\]]+\]\([^)]+\)/m.test(todo)
const hasCompletedEvidence = /\bCompletado:\b/i.test(done)

if (!hasAnyOpenTask) {
  if (args.has('--require-no-done-tasks') && hasDoneMarkersInTodo) {
    fail('docs/todo.md still includes done markers ("Completado:")')
  }
  if (args.has('--require-merge-evidence') && !hasCompletedEvidence) {
    fail('docs/todo.done.md has no completion evidence ("Completado:")')
  }
  info('docs/todo.md has no open tasks; treating empty backlog as valid')
  process.exit(0)
}

if (args.has('--require-open-p0') && !hasP0Section) {
  fail('missing priority-0 section heading (### 0.*) in docs/todo.md')
}

if (args.has('--require-no-done-tasks') && hasDoneMarkersInTodo) {
  fail('docs/todo.md still includes done markers ("Completado:")')
}

if (args.has('--require-evidence') && !hasAnyEvidenceLink) {
  fail('docs/todo.md has no evidence references (inline code or links)')
}

if (args.has('--require-merge-evidence') && !hasCompletedEvidence) {
  fail('docs/todo.done.md has no completion evidence ("Completado:")')
}

info('todo sync checks passed')
