import { spawnSync } from 'node:child_process'

const checks = [
  { label: 'quality:gate', command: 'npm run quality:gate' },
  { label: 'quality:responsive', command: 'npm run quality:responsive' },
  { label: 'quality:mobile', command: 'npm run quality:mobile' }
]

const failures = []

for (const check of checks) {
  console.log(`[quality:merge] running: ${check.command}`)

  const result = spawnSync(check.command, {
    stdio: 'inherit',
    env: process.env,
    shell: true
  })

  if (result.error) {
    failures.push(`${check.label} (error: ${result.error.message})`)
    continue
  }

  if (typeof result.status === 'number' && result.status !== 0) {
    failures.push(`${check.label} (exit code ${result.status})`)
    continue
  }

  if (result.signal) {
    failures.push(`${check.label} (signal ${result.signal})`)
  }
}

if (failures.length > 0) {
  console.error('[quality:merge] failed checks:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('[quality:merge] all checks passed.')
