import { spawnSync } from 'node:child_process'

const steps = [
  {
    label: 'typecheck',
    command: 'npm run typecheck'
  },
  {
    label: 'unit-tests',
    command: 'npm run test'
  },
  {
    label: 'build',
    command: 'npm run build'
  },
  {
    label: 'e2e-smoke',
    command: 'npm run test:e2e:smoke'
  }
]

function runStep(step) {
  console.log(`[quality:merge] running ${step.label}`)

  const result = spawnSync(step.command, {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: process.env,
    shell: true
  })

  if (result.error) {
    throw result.error
  }

  if (typeof result.status === 'number' && result.status !== 0) {
    process.exit(result.status)
  }
}

for (const step of steps) {
  runStep(step)
}

console.log('[quality:merge] all checks passed')
