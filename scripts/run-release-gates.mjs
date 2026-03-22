import { spawnSync } from 'node:child_process'

const steps = [
  { label: 'validate', command: 'npm', args: ['run', 'validate'] },
  { label: 'package:splunk', command: 'npm', args: ['run', 'package:splunk'] },
]

for (const step of steps) {
  const result = spawnSync(step.command, step.args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  if (typeof result.status === 'number' && result.status !== 0) {
    process.exit(result.status)
  }

  if (result.error) {
    throw result.error
  }
}