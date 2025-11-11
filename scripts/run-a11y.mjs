import { access, readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve, relative, extname } from 'node:path'
import { spawn } from 'node:child_process'
import { parse } from '@vue/compiler-dom'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = resolve(__dirname, '..')
const distIndexPath = resolve(projectRoot, 'dist', 'index.html')

async function ensureBuild() {
  try {
    await access(distIndexPath)
  } catch {
    await new Promise((resolvePromise, rejectPromise) => {
      const child = spawn('npm', ['run', 'build'], {
        cwd: projectRoot,
        stdio: 'inherit',
        shell: process.platform === 'win32'
      })

      child.on('exit', (code) => {
        if (code === 0) {
          resolvePromise()
        } else {
          rejectPromise(new Error(`"npm run build" finalizó con código ${code}`))
        }
      })

      child.on('error', rejectPromise)
    })
  }
}

async function listVueFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
        continue
      }
      files.push(...(await listVueFiles(entryPath)))
    } else if (entry.isFile() && extname(entry.name) === '.vue') {
      files.push(entryPath)
    }
  }

  return files
}

function extractTemplate(source, filePath) {
  const match = source.match(/<template[^>]*>([\s\S]*?)<\/template>/i)
  if (!match) {
    throw new Error(`No se encontró bloque <template> en ${filePath}`)
  }
  return match[1]
}

function getStaticAttribute(node, name) {
  for (const prop of node.props ?? []) {
    if (prop.type === 6 && prop.name === name) {
      return prop.value?.content ?? ''
    }
    if (prop.type === 7 && prop.name === 'bind' && prop.arg?.type === 4 && prop.arg.content === name) {
      return '{dynamic}'
    }
  }
  return undefined
}

function hasTextDescendant(node) {
  if (!('children' in node) || !Array.isArray(node.children)) {
    return false
  }

  for (const child of node.children) {
    if (child.type === 2 && child.content.trim().length > 0) {
      return true
    }
    if (child.type === 5) {
      return true
    }
    if (child.type === 1 && hasTextDescendant(child)) {
      return true
    }
    if (child.type === 9) {
      if (child.branches.some((branch) => branch.children.some((branchChild) => hasTextDescendant(branchChild)))) {
        return true
      }
    }
    if (child.type === 10) {
      if (child.children.some((loopChild) => hasTextDescendant(loopChild))) {
        return true
      }
    }
  }

  return false
}

function collectAccessibilityIssues(ast, filePath) {
  const issues = []

  function visit(node) {
    if (node.type === 1) {
      const tag = node.tag.toLowerCase()

      if (tag === 'img') {
        const alt = getStaticAttribute(node, 'alt')
        if (alt === undefined) {
          issues.push({ filePath, message: '<img> sin atributo alt' })
        } else if (alt !== '{dynamic}' && alt.trim().length === 0) {
          issues.push({ filePath, message: '<img> con atributo alt vacío' })
        }
      }

      if (tag === 'button') {
        const ariaLabel = getStaticAttribute(node, 'aria-label')
        const ariaLabelledBy = getStaticAttribute(node, 'aria-labelledby')
        const hasName = ariaLabel || ariaLabelledBy || hasTextDescendant(node)
        if (!hasName) {
          issues.push({ filePath, message: '<button> sin nombre accesible' })
        }
      }

      if (tag === 'a') {
        const ariaLabel = getStaticAttribute(node, 'aria-label')
        const ariaLabelledBy = getStaticAttribute(node, 'aria-labelledby')
        const hasName = ariaLabel || ariaLabelledBy || hasTextDescendant(node)
        if (!hasName) {
          issues.push({ filePath, message: '<a> sin nombre accesible' })
        }
      }

      if (tag === 'section') {
        const labelled =
          getStaticAttribute(node, 'aria-label') ||
          getStaticAttribute(node, 'aria-labelledby') ||
          node.children?.some((child) => child.type === 1 && /^h[1-6]$/i.test(child.tag))
        if (!labelled) {
          issues.push({ filePath, message: '<section> sin título o etiqueta accesible' })
        }
      }
    }

    if ('children' in node && Array.isArray(node.children)) {
      for (const child of node.children) {
        visit(child)
      }
    }

    if (node.type === 9) {
      node.branches.forEach((branch) => {
        branch.children.forEach((branchChild) => visit(branchChild))
      })
    }

    if (node.type === 10) {
      node.children.forEach((loopChild) => visit(loopChild))
    }
  }

  ast.children.forEach((child) => visit(child))
  return issues
}

async function runAccessibilityAudit() {
  await ensureBuild()

  const vueFiles = await listVueFiles(resolve(projectRoot, 'src'))
  const issues = []

  for (const filePath of vueFiles) {
    const source = await readFile(filePath, 'utf8')
    const template = extractTemplate(source, filePath)
    const ast = parse(template, { comments: true })
    const fileIssues = collectAccessibilityIssues(ast, relative(projectRoot, filePath))
    issues.push(...fileIssues)
  }

  if (issues.length > 0) {
    console.error('Accesibilidad: se detectaron problemas en los templates:')
    for (const issue of issues) {
      console.error(`- ${issue.filePath}: ${issue.message}`)
    }
    process.exitCode = 1
    return
  }

  console.log('Accesibilidad: sin hallazgos en los templates analizados.')
}

runAccessibilityAudit().catch((error) => {
  console.error('Error al ejecutar la auditoría de accesibilidad:', error)
  process.exit(1)
})
