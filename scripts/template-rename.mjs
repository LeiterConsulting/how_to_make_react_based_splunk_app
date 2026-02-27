import fs from 'node:fs'
import path from 'node:path'

const OLD_APP_ID = 'splunk_react_app'
const OLD_APP_LABEL = 'Splunk React App'
const APP_LOGO_PLACEHOLDER_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO5n9xkAAAAASUVORK5CYII='

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

function ensureAppId(id) {
  if (!/^[a-z][a-z0-9_]{2,62}$/.test(id)) {
    throw new Error('Invalid --appId. Use lowercase letters/numbers/underscore, start with a letter, 3-63 chars.')
  }
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function write(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8')
}

function replaceInFile(filePath, replacements) {
  let content = read(filePath)
  let updated = content
  for (const [from, to] of replacements) {
    updated = updated.split(from).join(to)
  }
  if (updated !== content) write(filePath, updated)
}

function setAppConfLabel(filePath, appLabel) {
  if (!fs.existsSync(filePath)) return
  const content = read(filePath)
  const updated = content.replace(/^(\s*label\s*=\s*).+$/m, `$1${appLabel}`)
  if (updated !== content) write(filePath, updated)
}

function setViewLabel(filePath, appLabel) {
  if (!fs.existsSync(filePath)) return
  const content = read(filePath)
  const updated = content.replace(/(<label>)([^<]*)(<\/label>)/, `$1${appLabel}$3`)
  if (updated !== content) write(filePath, updated)
}

function listAppFolders(splunkAppRoot) {
  if (!fs.existsSync(splunkAppRoot)) return []
  return fs
    .readdirSync(splunkAppRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
}

function readAppLabel(appDir) {
  const appConf = path.join(appDir, 'default', 'app.conf')
  if (!fs.existsSync(appConf)) return OLD_APP_LABEL
  const content = read(appConf)
  const match = content.match(/^\s*label\s*=\s*(.+)$/m)
  return match ? match[1].trim() : OLD_APP_LABEL
}

function ensureAppLogo(appDir) {
  const staticDir = path.join(appDir, 'static')
  const logoPath = path.join(staticDir, 'appLogo.png')
  fs.mkdirSync(staticDir, { recursive: true })
  if (!fs.existsSync(logoPath)) {
    fs.writeFileSync(logoPath, Buffer.from(APP_LOGO_PLACEHOLDER_BASE64, 'base64'))
  }
}

function ensureHomeView(activeAppDir, sourceAppId) {
  const viewsDir = path.join(activeAppDir, 'default', 'data', 'ui', 'views')
  const homeView = path.join(viewsDir, 'home.xml')
  const sourceView = path.join(viewsDir, `${sourceAppId}.xml`)
  if (!fs.existsSync(homeView) && fs.existsSync(sourceView)) {
    fs.renameSync(sourceView, homeView)
  }
}

function removeLegacyAppIdView(activeAppDir, appId) {
  const viewsDir = path.join(activeAppDir, 'default', 'data', 'ui', 'views')
  const homeView = path.join(viewsDir, 'home.xml')
  const legacyView = path.join(viewsDir, `${appId}.xml`)
  if (fs.existsSync(homeView) && fs.existsSync(legacyView) && legacyView !== homeView) {
    fs.unlinkSync(legacyView)
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const appId = (args.appId || '').trim()
  const sourceAppIdArg = (args.sourceAppId || '').trim()

  if (!appId) {
    throw new Error('Missing required argument --appId')
  }
  ensureAppId(appId)

  const root = process.cwd()
  const splunkAppRoot = path.join(root, 'splunk_app')
  const appFolders = listAppFolders(splunkAppRoot)

  let sourceAppId = sourceAppIdArg
  if (!sourceAppId) {
    if (appFolders.includes(OLD_APP_ID)) {
      sourceAppId = OLD_APP_ID
    } else if (appFolders.includes(appId)) {
      sourceAppId = appId
    } else if (appFolders.length === 1) {
      ;[sourceAppId] = appFolders
    }
  }

  if (!sourceAppId) {
    throw new Error(
      `Could not determine source app folder under splunk_app/. Found: ${appFolders.join(', ') || '(none)'}\n` +
        `Pass --sourceAppId <id> explicitly.`,
    )
  }

  const sourceAppDir = path.join(splunkAppRoot, sourceAppId)
  if (!fs.existsSync(sourceAppDir)) {
    throw new Error(`Could not find source app folder: ${sourceAppDir}`)
  }

  const sourceAppLabel = readAppLabel(sourceAppDir)
  const appLabel = (args.appLabel || '').trim() || sourceAppLabel

  if (appId === sourceAppId && appLabel === sourceAppLabel) {
    console.log('No changes needed.')
    return
  }

  const newAppDir = path.join(root, 'splunk_app', appId)

  if (appId !== sourceAppId) {
    if (fs.existsSync(newAppDir)) {
      throw new Error(`Target app folder already exists: ${newAppDir}`)
    }
    fs.renameSync(sourceAppDir, newAppDir)
  }

  const activeAppDir = appId === sourceAppId ? sourceAppDir : newAppDir

  ensureHomeView(activeAppDir, sourceAppId)
  removeLegacyAppIdView(activeAppDir, appId)

  const homeViewFile = path.join(activeAppDir, 'default', 'data', 'ui', 'views', 'home.xml')

  const filesToPatch = [
    path.join(root, 'README.md'),
    path.join(root, 'scripts', 'splunk-sync.mjs'),
    path.join(root, 'scripts', 'splunk-package.mjs'),
    path.join(root, 'vite.splunk.config.ts'),
    path.join(root, 'src', 'appClient.ts'),
    path.join(root, 'src', 'splunk', 'splunkMain.tsx'),
    path.join(activeAppDir, 'bin', 'app_access.py'),
    path.join(activeAppDir, 'appserver', 'controllers', 'app_rest_proxy.py'),
    path.join(activeAppDir, 'appserver', 'controllers', 'apprestproxy.py'),
    path.join(activeAppDir, 'appserver', 'controllers', 'app_page.py'),
    path.join(activeAppDir, 'app.manifest'),
    path.join(activeAppDir, 'default', 'app.conf'),
    path.join(activeAppDir, 'default', 'distsearch.conf'),
    path.join(activeAppDir, 'default', 'restmap.conf'),
    path.join(activeAppDir, 'default', 'web.conf'),
    path.join(activeAppDir, 'default', 'authorize.conf'),
    path.join(activeAppDir, 'default', 'app_settings.conf'),
    path.join(activeAppDir, 'default', 'data', 'ui', 'nav', 'default.xml'),
    homeViewFile,
  ]

  const replacements = [[sourceAppId, appId]]

  for (const file of filesToPatch) {
    if (fs.existsSync(file)) replaceInFile(file, replacements)
  }

  setAppConfLabel(path.join(activeAppDir, 'default', 'app.conf'), appLabel)
  setViewLabel(homeViewFile, appLabel)

  ensureAppLogo(activeAppDir)

  console.log(`Template renamed to appId='${appId}', appLabel='${appLabel}'.`)
}

main()
