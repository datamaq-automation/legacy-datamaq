#!/usr/bin/env node

import process from 'node:process'

const repoArg = process.argv[2] || 'AgustinMadygraf/profebustos-www'
const branchArg = process.argv[3] || 'main'
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN

if (!repoArg.includes('/')) {
  console.error('Uso: node scripts/check-branch-protection.mjs <owner/repo> [branch]')
  process.exit(1)
}

if (!token) {
  console.error('Falta token: define GITHUB_TOKEN o GH_TOKEN para consultar branch protection.')
  process.exit(1)
}

const [owner, repo] = repoArg.split('/')
const apiUrl = `https://api.github.com/repos/${owner}/${repo}/branches/${branchArg}/protection`

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
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    const body = await response.text()
    console.error(`Error consultando branch protection: ${response.status} ${response.statusText}`)
    console.error(body)
    process.exit(1)
  }

  const data = await response.json()
  const requiredChecks = data?.required_status_checks?.contexts ?? []

  console.log(`Repo: ${owner}/${repo}`)
  console.log(`Branch: ${branchArg}`)
  console.log('Required checks detectados:')
  if (requiredChecks.length === 0) {
    console.log('- (ninguno)')
  } else {
    for (const check of requiredChecks) {
      console.log(`- ${check}`)
    }
  }

  const requiredJobs = ['Todo Sync', 'Quality Gate', 'Smoke E2E']
  const missingJobs = requiredJobs.filter((job) => !hasCheck(requiredChecks, job))

  if (missingJobs.length > 0) {
    console.error(
      `FAIL: faltan checks requeridos del flujo FTPS (${missingJobs.map((job) => `\`${job}\``).join(', ')}).`
    )
    process.exit(1)
  }

  console.log('OK: branch protection incluye `Todo Sync`, `Quality Gate` y `Smoke E2E`.')
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error inesperado: ${error.message}`)
  } else {
    console.error('Error inesperado consultando branch protection.')
  }
  process.exit(1)
}
