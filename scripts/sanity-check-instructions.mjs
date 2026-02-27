import fs from 'node:fs'
import path from 'node:path'

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function listMarkdownFiles(rootDir) {
  const files = []
  if (!fs.existsSync(rootDir)) return files

  const stack = [rootDir]
  while (stack.length > 0) {
    const current = stack.pop()
    const entries = fs.readdirSync(current, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(fullPath)
        continue
      }
      if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        files.push(fullPath)
      }
    }
  }

  return files
}

function relative(root, filePath) {
  return path.relative(root, filePath).split(path.sep).join('/')
}

function getLineNumber(content, index) {
  if (index < 0) return 1
  return content.slice(0, index).split('\n').length
}

function main() {
  const root = path.resolve(process.cwd())
  const docsDir = path.join(root, 'docs')
  const files = [path.join(root, 'README.md'), ...listMarkdownFiles(docsDir)]
    .filter((filePath) => {
      const rel = relative(root, filePath)
      return !rel.startsWith('docs/feedback/')
    })

  const checks = []
  const errors = []

  const forbiddenPatterns = [
    {
      regex: /launcher[-\s](?:native[-\s]view|view)[^\n]{0,140}(?:must|required|requirement|enforce|enforced)[^\n]{0,140}\/custom\//gi,
      reason: 'Launcher-view baseline must not require /custom routes.',
    },
    {
      regex: /controller[-\s]native[^\n]{0,120}(?:is required(?:\s+baseline)?|required by default|must be default|must be required baseline)/gi,
      reason: 'Controller-native wording must remain optional/runtime-qualified.',
    },
    {
      regex: /launcher-bridge/gi,
      reason: 'Deprecated host-mode term detected; use launcher-native-view.',
    },
  ]

  for (const filePath of files) {
    const content = readText(filePath)
    const rel = relative(root, filePath)

    for (const { regex, reason } of forbiddenPatterns) {
      checks.push(`No forbidden instruction pattern (${reason})`)
      regex.lastIndex = 0
      const match = regex.exec(content)
      if (match) {
        const line = getLineNumber(content, match.index)
        errors.push(`${rel}:${line} -> ${reason}`)
      }
    }
  }

  const requiredFileChecks = [
    {
      filePath: path.join(root, 'docs', '19-splunk10-native-baseline.md'),
      regex: /launcher-native-view/i,
      reason: 'Baseline doc must explicitly name launcher-native-view as deterministic host mode.',
    },
    {
      filePath: path.join(root, 'docs', '18-native-feasibility-check.md'),
      regex: /custom-controller available|custom-controller unavailable/i,
      reason: 'Feasibility doc must preserve explicit controller classification outputs.',
    },
    {
      filePath: path.join(root, 'docs', '08-smoke-test.md'),
      regex: /native-page objective/i,
      reason: 'Smoke test must preserve native-page objective gate wording.',
    },
  ]

  for (const { filePath, regex, reason } of requiredFileChecks) {
    checks.push(`Required guidance present (${reason})`)
    if (!fs.existsSync(filePath)) {
      errors.push(`${relative(root, filePath)}: missing file (${reason})`)
      continue
    }
    const content = readText(filePath)
    if (!regex.test(content)) {
      errors.push(`${relative(root, filePath)}: missing required pattern (${reason})`)
    }
  }

  if (errors.length > 0) {
    console.error('❌ instruction drift check failed.')
    for (const error of errors) {
      console.error(`  - ${error}`)
    }
    process.exit(1)
  }

  console.log(`✅ instruction drift check passed. (${checks.length} checks)`)
}

main()
