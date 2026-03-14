import { spawnSync } from 'node:child_process'

const args = ['playwright', 'test', 'tests/e2e/a11y.spec.ts', '--project=chromium']
const result = spawnSync('npx', args, {
  stdio: 'inherit',
  shell: true
})

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}

console.log('[a11y] playwright a11y smoke checks passed')
