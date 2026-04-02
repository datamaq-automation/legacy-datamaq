import { readdir, readFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'

const DEFAULT_ROOT_DIR = resolve(process.cwd(), 'src')
const CANDIDATE_FILE_RE = /(Adapter|Facade|Controller|Service|Handler)\.ts$/
const CONTROL_FLOW_RE = /\b(if|switch|for|while|try|catch|throw|await|new)\b/
const NON_EMPTY_LINE_RE = /\S/

function toRel(path) {
  return path.replace(process.cwd(), '.').replace(/\\/g, '/')
}

function stripComments(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
}

function findMatchingBrace(source, openIndex) {
  let depth = 0
  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index]
    if (char === '{') {
      depth += 1
    } else if (char === '}') {
      depth -= 1
      if (depth === 0) {
        return index
      }
    }
  }
  return -1
}

function extractExportedFunctionBodies(source) {
  const bodies = []
  const exportFunctionRe = /export function\s+\w+\s*\([^)]*\)\s*(?::\s*[^({]+)?\s*\{/g

  let match
  while ((match = exportFunctionRe.exec(source)) !== null) {
    const openBraceIndex = source.indexOf('{', match.index)
    const closeBraceIndex = findMatchingBrace(source, openBraceIndex)
    if (closeBraceIndex === -1) {
      continue
    }
    bodies.push(source.slice(openBraceIndex + 1, closeBraceIndex).trim())
    exportFunctionRe.lastIndex = closeBraceIndex + 1
  }

  return bodies
}

function extractExportedClassMethodBodies(source) {
  const classMatch = source.match(/export class\s+\w+[^{]*\{/)
  if (!classMatch) {
    return []
  }

  const openBraceIndex = source.indexOf('{', classMatch.index)
  const closeBraceIndex = findMatchingBrace(source, openBraceIndex)
  if (closeBraceIndex === -1) {
    return []
  }

  const classBody = source.slice(openBraceIndex + 1, closeBraceIndex)
  const methodBodies = []
  const methodRe = /(^|\n)\s*(?!constructor\b)(?!private\b)(?!protected\b)(?!get\b)(?!set\b)(\w+)\s*\([^)]*\)\s*(?::\s*[^({]+)?\s*\{/g

  let match
  while ((match = methodRe.exec(classBody)) !== null) {
    const relativeOpenBraceIndex = classBody.indexOf('{', match.index + match[1].length)
    const relativeCloseBraceIndex = findMatchingBrace(classBody, relativeOpenBraceIndex)
    if (relativeCloseBraceIndex === -1) {
      continue
    }
    methodBodies.push(classBody.slice(relativeOpenBraceIndex + 1, relativeCloseBraceIndex).trim())
    methodRe.lastIndex = relativeCloseBraceIndex + 1
  }

  return methodBodies
}

function isSimplePassthroughBody(body) {
  const normalized = body
    .replace(/\s+/g, ' ')
    .replace(/;+\s*$/g, '')
    .trim()

  if (!normalized) {
    return false
  }

  return [
    /^return\s+[\w$.]+\([^{}]*\)$/,
    /^[\w$.]+\([^{}]*\)$/,
    /^return\s+[\w$.]+$/,
    /^return\s+Boolean\([^{}]*\)$/
  ].some((pattern) => pattern.test(normalized))
}

function shouldFlagFile(content) {
  const stripped = stripComments(content)

  if (CONTROL_FLOW_RE.test(stripped)) {
    return false
  }

  const codeLines = stripped.split(/\r?\n/).filter((line) => NON_EMPTY_LINE_RE.test(line))
  if (codeLines.length > 80) {
    return false
  }

  const functionBodies = extractExportedFunctionBodies(stripped)
  const methodBodies = extractExportedClassMethodBodies(stripped)
  const bodies = [...functionBodies, ...methodBodies]

  if (bodies.length === 0) {
    return false
  }

  return bodies.every(isSimplePassthroughBody)
}

async function collectCandidateFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectCandidateFiles(fullPath)))
      continue
    }

    if (entry.isFile() && extname(entry.name) === '.ts' && CANDIDATE_FILE_RE.test(entry.name)) {
      files.push(fullPath)
    }
  }

  return files
}

export async function checkPassThroughWrappers(options = {}) {
  const rootDir = options.rootDir ? resolve(options.rootDir) : DEFAULT_ROOT_DIR
  const files = await collectCandidateFiles(rootDir)
  const violations = []

  for (const file of files) {
    const content = await readFile(file, 'utf8')
    if (shouldFlagFile(content)) {
      violations.push({
        filePath: toRel(file),
        reason: 'candidate wrapper delegates 1:1 without visible policy'
      })
    }
  }

  return {
    scannedFiles: files.length,
    violations
  }
}

async function main() {
  const report = await checkPassThroughWrappers()

  for (const violation of report.violations) {
    console.error(`[passthrough-wrappers] ${violation.reason} file=${violation.filePath}`)
  }

  if (report.violations.length > 0) {
    process.exitCode = 1
    return
  }

  console.log(`[passthrough-wrappers] scanned=${report.scannedFiles} violations=0`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('[passthrough-wrappers] check failed', error)
    process.exitCode = 1
  })
}
