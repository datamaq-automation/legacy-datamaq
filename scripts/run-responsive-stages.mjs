import { spawnSync } from 'node:child_process'

const stages = [
  {
    id: 'XS',
    description: 'small mobile fold and primary CTA',
    command: 'npm run test:e2e:smoke:xs'
  },
  {
    id: 'SM',
    description: 'mobile navigation and consent interactions',
    command: 'npm run test:e2e:smoke:sm'
  },
  {
    id: 'MD',
    description: 'tablet layout',
    command: 'npm run test:e2e:smoke:md'
  },
  {
    id: 'LG',
    description: 'desktop layout',
    command: 'npm run test:e2e:smoke:lg'
  }
]

for (const stage of stages) {
  console.log(`[quality:responsive] stage ${stage.id} (${stage.description})`)
  console.log(`[quality:responsive] running: ${stage.command}`)

  const result = spawnSync(stage.command, {
    stdio: 'inherit',
    env: process.env,
    shell: true
  })

  if (result.error) {
    console.error(
      `[quality:responsive] stage ${stage.id} failed with error: ${result.error.message}`
    )
    process.exit(1)
  }

  if (typeof result.status === 'number' && result.status !== 0) {
    console.error(`[quality:responsive] stage ${stage.id} failed (exit code ${result.status}).`)
    process.exit(result.status)
  }

  if (result.signal) {
    console.error(`[quality:responsive] stage ${stage.id} interrupted by signal ${result.signal}.`)
    process.exit(1)
  }
}

console.log('[quality:responsive] all responsive stages passed in order.')
