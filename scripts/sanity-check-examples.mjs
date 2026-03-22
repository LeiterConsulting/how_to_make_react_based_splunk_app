import fs from 'node:fs'
import path from 'node:path'

function relative(root, filePath) {
  return path.relative(root, filePath).split(path.sep).join('/')
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function expectFile(root, baseDir, relativePath, errors) {
  const fullPath = path.join(baseDir, relativePath)
  if (!fs.existsSync(fullPath)) {
    errors.push(`${relative(root, fullPath)}: missing required example file`)
  }
}

function main() {
  const root = path.resolve(process.cwd())
  const examplesRoot = path.join(root, 'examples')
  const errors = []
  const checks = []

  if (!fs.existsSync(examplesRoot)) {
    console.error('❌ example sanity check failed.')
    console.error('  - examples/: examples folder is missing')
    process.exit(1)
  }

  const entries = fs.readdirSync(examplesRoot, { withFileTypes: true })
  const exampleDirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(examplesRoot, entry.name))

  checks.push('Examples root exists')

  for (const exampleDir of exampleDirs) {
    const manifestPath = path.join(exampleDir, 'example.manifest.json')
    const readmePath = path.join(exampleDir, 'README.md')

    checks.push(`Example manifest present for ${relative(root, exampleDir)}`)
    if (!fs.existsSync(manifestPath)) {
      errors.push(`${relative(root, manifestPath)}: missing example manifest`)
      continue
    }

    if (!fs.existsSync(readmePath)) {
      errors.push(`${relative(root, readmePath)}: missing example README`)
      continue
    }

    const manifest = readJson(manifestPath)
    const readme = fs.readFileSync(readmePath, 'utf8')

    if (!manifest.id || !manifest.label || !manifest.appShape || !manifest.uiMode || !manifest.primaryPrompt || !manifest.summary) {
      errors.push(`${relative(root, manifestPath)}: manifest must define id, label, appShape, uiMode, primaryPrompt, and summary`)
    }

    if (!Array.isArray(manifest.keywords) || manifest.keywords.length === 0) {
      errors.push(`${relative(root, manifestPath)}: manifest must define a non-empty keywords array`)
    }

    if (!Array.isArray(manifest.requiredFiles) || manifest.requiredFiles.length === 0) {
      errors.push(`${relative(root, manifestPath)}: manifest must define requiredFiles`)
      continue
    }

    if (!readme.includes('example.manifest.json')) {
      errors.push(`${relative(root, readmePath)}: README must reference example.manifest.json in the folder map`)
    }

    expectFile(root, exampleDir, manifest.primaryPrompt, errors)
    for (const requiredFile of manifest.requiredFiles) {
      expectFile(root, exampleDir, requiredFile, errors)
    }
  }

  if (exampleDirs.length === 0) {
    errors.push('examples/: expected at least one worked example directory')
  }

  if (errors.length > 0) {
    console.error('❌ example sanity check failed.')
    for (const error of errors) {
      console.error(`  - ${error}`)
    }
    process.exit(1)
  }

  console.log(`✅ example sanity check passed. (${checks.length} checks)`)
}

main()