import { spawnSync } from 'node:child_process'

const steps = [
  {
    label: 'quality-fast',
    command: 'npm run quality:fast'
  },
  {
    label: 'build',
    command: 'npm run build'
  },
  {
    label: 'quality-e2e',
    command: 'npm run quality:e2e'
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
