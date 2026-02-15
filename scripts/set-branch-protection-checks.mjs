#!/usr/bin/env node

import process from 'node:process'

const repoArg = process.argv[2] || 'AgustinMadygraf/profebustos-www'
const branchArg = process.argv[3] || 'main'
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN

if (!repoArg.includes('/')) {
  console.error('Uso: node scripts/set-branch-protection-checks.mjs <owner/repo> [branch]')
  process.exit(1)
}

if (!token) {
  console.error('Falta token: define GITHUB_TOKEN o GH_TOKEN para actualizar branch protection.')
  process.exit(1)
}

const [owner, repo] = repoArg.split('/')
const apiUrl = `https://api.github.com/repos/${owner}/${repo}/branches/${branchArg}/protection/required_status_checks`
const requiredContexts = ['Todo Sync', 'Quality Gate', 'Smoke E2E']

function normalize(str) {
  return String(str ?? '')
    .trim()
    .toLowerCase()
}

function hasCheck(contexts, expected) {
  const target = normalize(expected)
  return contexts.some((ctx) => {
    const normalized = normalize(ctx)
    return normalized === target || normalized.endsWith(`/ ${target}`)
  })
}

try {
  const response = await fetch(apiUrl, {
    method: 'PATCH',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: JSON.stringify({
      strict: false,
      contexts: requiredContexts
    })
  })

  if (!response.ok) {
    const body = await response.text()
    console.error(`Error actualizando branch protection: ${response.status} ${response.statusText}`)
    console.error(body)
    process.exit(1)
  }

  const data = await response.json()
  const contexts = data?.contexts ?? []

  console.log(`Repo: ${owner}/${repo}`)
  console.log(`Branch: ${branchArg}`)
  console.log('Required checks configurados:')
  if (contexts.length === 0) {
    console.log('- (ninguno)')
  } else {
    for (const context of contexts) {
      console.log(`- ${context}`)
    }
  }

  const missing = requiredContexts.filter((context) => !hasCheck(contexts, context))
  if (missing.length > 0) {
    console.error(`FAIL: faltan checks requeridos tras el PATCH (${missing.map((m) => `\`${m}\``).join(', ')}).`)
    process.exit(1)
  }

  console.log('OK: required checks configurados (`Todo Sync`, `Quality Gate`, `Smoke E2E`).')
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error inesperado: ${error.message}`)
  } else {
    console.error('Error inesperado actualizando branch protection.')
  }
  process.exit(1)
}
