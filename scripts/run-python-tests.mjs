import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const projectRoot = path.resolve(process.cwd())

function candidateCommands(root) {
  const virtualEnv = process.env.VIRTUAL_ENV
  const candidates = []

  if (virtualEnv) {
    candidates.push({
      command: process.platform === 'win32' ? path.join(virtualEnv, 'Scripts', 'python.exe') : path.join(virtualEnv, 'bin', 'python'),
      args: ['-m', 'unittest', 'discover', '-s', 'tests/python', '-p', 'test_*.py'],
      checkFile: true,
    })
  }

  candidates.push(
    {
      command: path.join(root, '.venv', process.platform === 'win32' ? 'Scripts' : 'bin', process.platform === 'win32' ? 'python.exe' : 'python'),
      args: ['-m', 'unittest', 'discover', '-s', 'tests/python', '-p', 'test_*.py'],
      checkFile: true,
    },
    {
      command: path.join(root, 'venv', process.platform === 'win32' ? 'Scripts' : 'bin', process.platform === 'win32' ? 'python.exe' : 'python'),
      args: ['-m', 'unittest', 'discover', '-s', 'tests/python', '-p', 'test_*.py'],
      checkFile: true,
    },
  )

  if (process.platform === 'win32') {
    candidates.push(
      { command: 'python', args: ['-m', 'unittest', 'discover', '-s', 'tests/python', '-p', 'test_*.py'] },
      { command: 'py', args: ['-3', '-m', 'unittest', 'discover', '-s', 'tests/python', '-p', 'test_*.py'] },
    )
  } else {
    candidates.push(
      { command: 'python3', args: ['-m', 'unittest', 'discover', '-s', 'tests/python', '-p', 'test_*.py'] },
      { command: 'python', args: ['-m', 'unittest', 'discover', '-s', 'tests/python', '-p', 'test_*.py'] },
    )
  }

  return candidates
}

let lastMissingCommand = null

for (const candidate of candidateCommands(projectRoot)) {
  if (candidate.checkFile && !fs.existsSync(candidate.command)) {
    lastMissingCommand = candidate.command
    continue
  }

  const result = spawnSync(candidate.command, candidate.args, {
    stdio: 'inherit',
    cwd: projectRoot,
  })

  if (result.error && result.error.code === 'ENOENT') {
    lastMissingCommand = candidate.command
    continue
  }

  if (typeof result.status === 'number') {
    process.exit(result.status)
  }

  throw result.error ?? new Error(`Failed to run backend tests with ${candidate.command}`)
}

throw new Error(`Unable to locate a Python interpreter for backend tests. Last checked: ${lastMissingCommand ?? '(none)'}`)