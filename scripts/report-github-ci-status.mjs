#!/usr/bin/env node

import process from 'node:process'

const repoArg = process.argv[2] || 'AgustinMadygraf/profebustos-www'
const workflowArg = process.argv[3] || 'ci-cd-ftps.yml'
const branchArg = process.argv[4] || 'main'

if (!repoArg.includes('/')) {
  console.error('Uso: node scripts/report-github-ci-status.mjs <owner/repo> [workflow] [branch]')
  process.exit(1)
}

const [owner, repo] = repoArg.split('/')
const apiBase = 'https://api.github.com'

async function getJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json'
    }
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`${response.status} ${response.statusText}: ${body}`)
  }

  return response.json()
}

function format(value) {
  return value == null || value === '' ? '-' : String(value)
}

try {
  const runsUrl =
    `${apiBase}/repos/${owner}/${repo}/actions/workflows/${workflowArg}` +
    `/runs?branch=${encodeURIComponent(branchArg)}&per_page=5`
  const runsData = await getJson(runsUrl)
  const runs = runsData.workflow_runs ?? []

  console.log(`Repo: ${owner}/${repo}`)
  console.log(`Workflow: ${workflowArg}`)
  console.log(`Branch: ${branchArg}`)
  console.log('')

  if (runs.length === 0) {
    console.log('Sin runs para el filtro indicado.')
    process.exit(0)
  }

  console.log('Ultimos runs:')
  for (const run of runs) {
    console.log(
      `- id=${run.id} event=${format(run.event)} status=${format(run.status)} ` +
        `conclusion=${format(run.conclusion)} created_at=${format(run.created_at)}`
    )
    console.log(`  ${format(run.html_url)}`)
  }

  const latestRun = runs[0]
  const jobsUrl = `${apiBase}/repos/${owner}/${repo}/actions/runs/${latestRun.id}/jobs`
  const jobsData = await getJson(jobsUrl)
  const jobs = jobsData.jobs ?? []

  console.log('')
  console.log(`Jobs del run mas reciente (${latestRun.id}):`)
  if (jobs.length === 0) {
    console.log('- Sin jobs disponibles.')
    process.exit(0)
  }

  for (const job of jobs) {
    console.log(
      `- ${format(job.name)}: status=${format(job.status)} conclusion=${format(job.conclusion)}`
    )
  }
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error consultando GitHub API: ${error.message}`)
  } else {
    console.error('Error consultando GitHub API')
  }
  process.exit(1)
}
