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
  const checks = []
  const errors = []
  const requiredFileChecks = [
    {
      filePath: path.join(root, 'chat.md'),
      regex: /Add this file to your IDE chat/i,
      reason: 'chat.md must explicitly tell users to attach it to the chat session.',
    },
    {
      filePath: path.join(root, 'AGENTS.md'),
      regex: /Splunk app generator starter/i,
      reason: 'AGENTS.md must declare the repo mission clearly.',
    },
    {
      filePath: path.join(root, '.github', 'copilot-instructions.md'),
      regex: /chat\.md/i,
      reason: 'Workspace instructions must route agents to chat.md.',
    },
    {
      filePath: path.join(root, '.github', 'instructions', 'generated-app-surface.instructions.md'),
      regex: /generated app implementation surfaces/i,
      reason: 'Generated app instruction file must define the app-specific editing surface.',
    },
    {
      filePath: path.join(root, '.github', 'prompts', 'build-splunk-app.prompt.md'),
      regex: /template:rename/i,
      reason: 'Prompt file must include the rename flow.',
    },
    {
      filePath: path.join(root, '.github', 'prompts', 'build-dashboard-first-app.prompt.md'),
      regex: /dashboard-first/i,
      reason: 'Dashboard-first prompt preset must declare its app shape.',
    },
    {
      filePath: path.join(root, '.github', 'prompts', 'build-rest-crud-app.prompt.md'),
      regex: /CRUD/i,
      reason: 'REST CRUD prompt preset must declare its app shape.',
    },
    {
      filePath: path.join(root, '.github', 'prompts', 'build-search-driven-app.prompt.md'),
      regex: /search-driven/i,
      reason: 'Search-driven prompt preset must declare its app shape.',
    },
    {
      filePath: path.join(root, 'README.md'),
      regex: /chat\.md/i,
      reason: 'README must direct users to the chat context pack.',
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

  const archivedDocs = listMarkdownFiles(path.join(root, 'docs', 'archive'))
  checks.push('Archived docs folder is excluded from active instruction checks')
  if (archivedDocs.length === 0) {
    errors.push('docs/archive: expected archived documentation files to remain available')
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
