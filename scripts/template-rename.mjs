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

function ensureAppLogo(appDir) {
  const staticDir = path.join(appDir, 'static')
  const logoPath = path.join(staticDir, 'appLogo.png')
  fs.mkdirSync(staticDir, { recursive: true })
  if (!fs.existsSync(logoPath)) {
    fs.writeFileSync(logoPath, Buffer.from(APP_LOGO_PLACEHOLDER_BASE64, 'base64'))
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const appId = (args.appId || '').trim()
  const appLabel = (args.appLabel || '').trim() || OLD_APP_LABEL

  if (!appId) {
    throw new Error('Missing required argument --appId')
  }
  ensureAppId(appId)

  if (appId === OLD_APP_ID && appLabel === OLD_APP_LABEL) {
    console.log('No changes needed.')
    return
  }

  const root = process.cwd()
  const oldAppDir = path.join(root, 'splunk_app', OLD_APP_ID)
  const newAppDir = path.join(root, 'splunk_app', appId)

  if (!fs.existsSync(oldAppDir) && !fs.existsSync(newAppDir)) {
    throw new Error('Could not find source app folder under splunk_app/.')
  }

  if (fs.existsSync(oldAppDir) && appId !== OLD_APP_ID) {
    if (fs.existsSync(newAppDir)) {
      throw new Error(`Target app folder already exists: ${newAppDir}`)
    }
    fs.renameSync(oldAppDir, newAppDir)
  }

  const activeAppDir = fs.existsSync(newAppDir) ? newAppDir : oldAppDir

  const oldViewFile = path.join(activeAppDir, 'default', 'data', 'ui', 'views', `${OLD_APP_ID}.xml`)
  const newViewFile = path.join(activeAppDir, 'default', 'data', 'ui', 'views', `${appId}.xml`)

  if (fs.existsSync(oldViewFile) && appId !== OLD_APP_ID) {
    if (fs.existsSync(newViewFile)) {
      throw new Error(`Target view file already exists: ${newViewFile}`)
    }
    fs.renameSync(oldViewFile, newViewFile)
  }

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
    path.join(activeAppDir, 'default', 'app.conf'),
    path.join(activeAppDir, 'default', 'restmap.conf'),
    path.join(activeAppDir, 'default', 'web.conf'),
    path.join(activeAppDir, 'default', 'authorize.conf'),
    path.join(activeAppDir, 'default', 'app_settings.conf'),
    path.join(activeAppDir, 'default', 'data', 'ui', 'nav', 'default.xml'),
    fs.existsSync(newViewFile) ? newViewFile : oldViewFile,
  ]

  const replacements = [
    [OLD_APP_ID, appId],
    [OLD_APP_LABEL, appLabel],
  ]

  for (const file of filesToPatch) {
    if (fs.existsSync(file)) replaceInFile(file, replacements)
  }

  ensureAppLogo(activeAppDir)

  console.log(`Template renamed to appId='${appId}', appLabel='${appLabel}'.`)
}

main()
