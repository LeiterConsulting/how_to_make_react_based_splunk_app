import fs from 'node:fs'
import path from 'node:path'

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (!token.startsWith('--')) continue
    const key = token.slice(2)
    const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : 'true'
    args[key] = value
    if (value !== 'true') i += 1
  }
  return args
}

function ensureAppId(appId) {
  if (!/^[a-z][a-z0-9_]{2,62}$/.test(appId)) {
    throw new Error(`Invalid appId: '${appId}'. Use lowercase letters/numbers/underscore, start with a letter, 3-63 chars.`)
  }
}

function listAppFolders(splunkAppRoot) {
  if (!fs.existsSync(splunkAppRoot)) return []
  return fs
    .readdirSync(splunkAppRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function getAppLabelFromAppConf(appConfPath) {
  if (!fs.existsSync(appConfPath)) return null
  const content = readText(appConfPath)
  const match = content.match(/^\s*label\s*=\s*(.+)$/m)
  return match ? match[1].trim() : null
}

function getDefaultViewFromAppConf(appConfPath) {
  if (!fs.existsSync(appConfPath)) return null
  const content = readText(appConfPath)
  const match = content.match(/^\s*default_view\s*=\s*(.+)$/m)
  return match ? match[1].trim() : null
}

function relative(root, filePath) {
  return path.relative(root, filePath).split(path.sep).join('/')
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const root = path.resolve(process.cwd())
  const splunkAppRoot = path.join(root, 'splunk_app')

  const detectedAppFolders = listAppFolders(splunkAppRoot)
  let appId = (args.appId || '').trim()

  if (!appId) {
    if (detectedAppFolders.length !== 1) {
      throw new Error(
        `Could not infer appId. Found ${detectedAppFolders.length} app folders under splunk_app/: ${detectedAppFolders.join(', ') || '(none)'}\n` +
          `Pass --appId <id> explicitly.`,
      )
    }
    ;[appId] = detectedAppFolders
  }

  ensureAppId(appId)

  const appDir = path.join(splunkAppRoot, appId)
  const appConfPath = path.join(appDir, 'default', 'app.conf')
  const navPath = path.join(appDir, 'default', 'data', 'ui', 'nav', 'default.xml')
  const viewsDir = path.join(appDir, 'default', 'data', 'ui', 'views')
  const restmapPath = path.join(appDir, 'default', 'restmap.conf')
  const webPath = path.join(appDir, 'default', 'web.conf')
  const defaultView = getDefaultViewFromAppConf(appConfPath)
  const defaultViewPath = path.join(viewsDir, `${defaultView || 'home'}.xml`)

  const checks = []
  const errors = []

  function requirePath(filePath, requirement) {
    checks.push(requirement)
    if (!fs.existsSync(filePath)) {
      errors.push(`${requirement}: missing ${relative(root, filePath)}`)
    }
  }

  function requireRegex(filePath, regex, requirement) {
    checks.push(requirement)
    if (!fs.existsSync(filePath)) {
      errors.push(`${requirement}: missing ${relative(root, filePath)}`)
      return
    }
    const content = readText(filePath)
    if (!regex.test(content)) {
      errors.push(`${requirement}: expected pattern ${regex} in ${relative(root, filePath)}`)
    }
  }

  function requireExactCapture(filePath, regex, expected, requirement) {
    checks.push(requirement)
    if (!fs.existsSync(filePath)) {
      errors.push(`${requirement}: missing ${relative(root, filePath)}`)
      return
    }
    const content = readText(filePath)
    const match = content.match(regex)
    if (!match) {
      errors.push(`${requirement}: pattern ${regex} not found in ${relative(root, filePath)}`)
      return
    }
    if (match[1] !== expected) {
      errors.push(
        `${requirement}: expected '${expected}' but found '${match[1]}' in ${relative(root, filePath)}`,
      )
    }
  }

  requirePath(appDir, 'App folder exists')
  requirePath(defaultViewPath, 'Configured launcher default view file exists')
  requirePath(path.join(appDir, 'static', 'appLogo.png'), 'App icon exists')

  requireRegex(appConfPath, /^\s*default_view\s*=\s*home\s*$/m, 'app.conf default_view is home')
  requireRegex(navPath, /<view\s+name=["']home["'][^>]*default=["']true["']/m, 'Nav default view is home')
  requireRegex(restmapPath, new RegExp(`match\\s*=\\s*/${appId}/app_api/`), 'restmap includes app-prefixed app_api routes')
  requireRegex(webPath, /pattern\s*=\s*app_rest_proxy\/\*/, 'web.conf exposes app_rest_proxy')
  requireRegex(webPath, /pattern\s*=\s*apprestproxy\/\*/, 'web.conf exposes apprestproxy')
  requireRegex(webPath, new RegExp(`pattern\\s*=\\s*${appId}/app_api/\\*\\*`), 'web.conf exposes app-scoped app_api routes')

  requireRegex(defaultViewPath, new RegExp(`stylesheet=["']${appId}\\.css["']`), 'Launcher view references appId CSS bundle')
  requireRegex(defaultViewPath, new RegExp(`script=["']${appId}\\.js["']`), 'Launcher view references appId JS bundle')
  requireRegex(defaultViewPath, /id=["']splunk-react-app-root["']/, 'Launcher view contains React root mount')

  checks.push('Launcher view does not include search stanzas')
  if (fs.existsSync(defaultViewPath)) {
    const launcherView = readText(defaultViewPath)
    if (/<search\b/i.test(launcherView)) {
      errors.push(`Launcher view does not include search stanzas: found <search> in ${relative(root, defaultViewPath)}`)
    }
  }

  requireExactCapture(
    path.join(root, 'src', 'appClient.ts'),
    /const\s+APP\s*=\s*'([^']+)'/,
    appId,
    'Frontend APP constant matches appId',
  )

  requireExactCapture(
    path.join(root, 'scripts', 'splunk-sync.mjs'),
    /const\s+appFolderName\s*=\s*'([^']+)'/,
    appId,
    'Sync script appFolderName matches appId',
  )

  requireExactCapture(
    path.join(root, 'scripts', 'splunk-package.mjs'),
    /const\s+appFolderName\s*=\s*'([^']+)'/,
    appId,
    'Package script appFolderName matches appId',
  )

  requireRegex(
    path.join(root, 'vite.splunk.config.ts'),
    new RegExp(`entryFileNames:\\s*'${appId}\\.js'`),
    'Vite Splunk config entry file matches appId',
  )

  requireRegex(
    path.join(root, 'vite.splunk.config.ts'),
    new RegExp(`return\\s*'${appId}\\.css'`),
    'Vite Splunk config CSS file matches appId',
  )

  requireRegex(
    path.join(root, 'vite.splunk.config.ts'),
    new RegExp(`fileName:\\s*\\(\\)\\s*=>\\s*'${appId}'`),
    'Vite Splunk lib fileName matches appId',
  )

  const expectedLabel = (args.appLabel || '').trim()
  if (expectedLabel) {
    checks.push('App label matches expected value')
    const actualLabel = getAppLabelFromAppConf(appConfPath)
    if (!actualLabel) {
      errors.push(`App label matches expected value: could not read label from ${relative(root, appConfPath)}`)
    } else if (actualLabel !== expectedLabel) {
      errors.push(`App label matches expected value: expected '${expectedLabel}' but found '${actualLabel}'`)
    }
  }

  if (errors.length > 0) {
    console.error(`❌ appId sanity check failed for '${appId}'.`)
    for (const error of errors) {
      console.error(`  - ${error}`)
    }
    process.exit(1)
  }

  console.log(`✅ appId sanity check passed for '${appId}'. (${checks.length} checks)`)
}

main()
