import { spawnSync } from 'node:child_process'

const checks = [
  { label: 'test:e2e:smoke', command: 'npm run test:e2e:smoke' },
  { label: 'test:a11y', command: 'npm run test:a11y' },
  { label: 'check:css', command: 'npm run check:css' }
]

const failures = []

for (const check of checks) {
  console.log(`[quality:mobile] running: ${check.command}`)

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
  console.error('[quality:mobile] failed checks:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('[quality:mobile] all checks passed.')
