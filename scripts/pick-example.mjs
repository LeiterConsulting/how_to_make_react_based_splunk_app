import fs from 'node:fs'
import path from 'node:path'

function parseArgs(argv) {
  const options = {}
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith('--')) continue
    const key = token.slice(2)
    const parts = []
    let cursor = index + 1
    while (argv[cursor] && !argv[cursor].startsWith('--')) {
      parts.push(argv[cursor])
      cursor += 1
    }
    const value = parts.length > 0 ? parts.join(' ') : 'true'
    options[key] = value
    if (parts.length > 0) index = cursor - 1
  }
  return options
}

function readManifests(root) {
  const examplesRoot = path.join(root, 'examples')
  return fs.readdirSync(examplesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const dir = path.join(examplesRoot, entry.name)
      const manifestPath = path.join(dir, 'example.manifest.json')
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
      return {
        ...manifest,
        directory: dir,
        readme: path.join(dir, 'README.md'),
      }
    })
}

function tokenize(value) {
  return String(value || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

function buildKeywordSet(example) {
  const parts = [
    example.id,
    example.label,
    example.appShape,
    example.uiMode,
    example.backend,
    example.persistence,
    example.summary,
    ...(Array.isArray(example.keywords) ? example.keywords : []),
  ]

  return new Set(parts.flatMap(tokenize))
}

function scoreExample(example, criteria) {
  let score = 0
  if (criteria.appShape && example.appShape === criteria.appShape) score += 4
  if (criteria.uiMode && example.uiMode === criteria.uiMode) score += 2
  if (criteria.backend && example.backend === criteria.backend) score += 2
  if (criteria.persistence && example.persistence === criteria.persistence) score += 2

  const requestedKeywords = [criteria.keywords, criteria.query, criteria.workflow]
    .flatMap(tokenize)

  if (requestedKeywords.length > 0) {
    const exampleKeywords = buildKeywordSet(example)
    for (const keyword of requestedKeywords) {
      if (exampleKeywords.has(keyword)) score += 1
    }
  }

  return score
}

function relative(root, filePath) {
  return path.relative(root, filePath).split(path.sep).join('/')
}

function parseTop(value, fallback) {
  const parsed = Number.parseInt(String(value || ''), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function toSerializable(root, entry) {
  if (!entry) return null
  return {
    id: entry.example.id,
    label: entry.example.label,
    score: entry.score,
    readme: relative(root, entry.example.readme),
    shape: entry.example.appShape,
    uiMode: entry.example.uiMode,
    backend: entry.example.backend,
    persistence: entry.example.persistence,
    summary: entry.example.summary,
  }
}

function main() {
  const root = path.resolve(process.cwd())
  const criteria = parseArgs(process.argv.slice(2))
  const examples = readManifests(root)

  if (examples.length === 0) {
    throw new Error('No worked examples are available.')
  }

  const ranked = examples
    .map((example) => ({ example, score: scoreExample(example, criteria) }))
    .sort((left, right) => right.score - left.score || left.example.label.localeCompare(right.example.label))

  const topCount = parseTop(criteria.top, 1)
  const topRanked = ranked.slice(0, topCount)

  const best = ranked[0]

  if (criteria.json === 'true') {
    const payload = {
      criteria,
      best: (best?.score ?? 0) > 0 ? toSerializable(root, best) : null,
      ranked: topRanked.map((entry) => toSerializable(root, entry)),
    }
    console.log(JSON.stringify(payload, null, 2))
    process.exit(0)
  }

  if ((best?.score ?? 0) === 0) {
    console.log('No exact manifest-based example match found.')
    console.log('Available examples:')
    for (const item of topRanked) {
      console.log(`- ${item.example.id}: ${relative(root, item.example.readme)}`)
    }
    process.exit(0)
  }

  console.log(`Best match: ${best.example.label}`)
  console.log(`id: ${best.example.id}`)
  console.log(`score: ${best.score}`)
  console.log(`readme: ${relative(root, best.example.readme)}`)
  console.log(`shape: ${best.example.appShape}`)
  console.log(`uiMode: ${best.example.uiMode}`)
  console.log(`backend: ${best.example.backend}`)
  console.log(`persistence: ${best.example.persistence}`)
  console.log(`summary: ${best.example.summary}`)

  if (topRanked.length > 1) {
    console.log('Top matches:')
    for (const item of topRanked) {
      console.log(`- ${item.example.id} (${item.score}): ${relative(root, item.example.readme)}`)
    }
  }
}

main()