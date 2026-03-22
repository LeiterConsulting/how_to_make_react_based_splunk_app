import { getSplunkCustomControllerBasePath, getSplunkServicesBasePath, getSplunkServicesNSBasePath, splunkFetchJSON } from './splunkFetch'
import type { StarterBootstrapResult, StarterDiagnosticsResult, StarterPingResult } from './components'

const APP = 'splunk_react_app'

function appApiPath(path = '') {
  return `${getSplunkServicesNSBasePath(APP)}/app_api${path}`
}

function appApiPathAppPrefixed(path = '') {
  return `${getSplunkServicesNSBasePath(APP)}/${APP}/app_api${path}`
}

function appApiPathServices(path = '') {
  return `${getSplunkServicesBasePath()}/app_api${path}`
}

function appApiPathServicesAppPrefixed(path = '') {
  return `${getSplunkServicesBasePath()}/${APP}/app_api${path}`
}

function appApiPathCustomController(path = '') {
  const base = getSplunkCustomControllerBasePath(APP, 'app_rest_proxy')
  return `${base}/services/${APP}/app_api${path}`
}

function isNotFoundError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const msg = error.message || ''
  return msg.includes('404') || msg.includes('Not Found')
}

async function fetchWithPathFallback<T>(pathSuffix: string, options: { method?: 'GET' | 'POST'; query?: Record<string, string>; form?: Record<string, string> } = {}) {
  const candidates = [
    appApiPath(pathSuffix),
    appApiPathAppPrefixed(pathSuffix),
    appApiPathServices(pathSuffix),
    appApiPathServicesAppPrefixed(pathSuffix),
    appApiPathCustomController(pathSuffix),
  ]

  // REVIEW: Preserve the attempted path list so Splunk runtime mismatches are actionable during smoke tests.
  let lastError: unknown = null
  const attempted: string[] = []
  for (const path of candidates) {
    attempted.push(path)
    try {
      return await splunkFetchJSON<T>({
        path,
        method: options.method,
        query: options.query,
        form: options.form,
      })
    } catch (error) {
      lastError = error
      if (!isNotFoundError(error)) throw error
    }
  }

  const attemptedText = attempted.join('\n')
  if (lastError instanceof Error) {
    throw new Error(`${lastError.message}\nAttempted paths:\n${attemptedText}`)
  }

  throw new Error(`All app endpoint path candidates failed\nAttempted paths:\n${attemptedText}`)
}

export async function pingStarter(): Promise<StarterPingResult> {
  const res = await fetchWithPathFallback<StarterPingResult>('/ping', { query: { output_mode: 'json' } })
  if (!res) throw new Error('Empty ping response')
  return res
}

export async function getStarterBootstrap(): Promise<StarterBootstrapResult> {
  const res = await fetchWithPathFallback<StarterBootstrapResult>('/bootstrap', { query: { output_mode: 'json' } })
  if (!res) throw new Error('Empty bootstrap response')
  return res
}

export async function getStarterDiagnostics(): Promise<StarterDiagnosticsResult> {
  const res = await fetchWithPathFallback<StarterDiagnosticsResult>('/diagnostics', { query: { output_mode: 'json' } })
  if (!res) throw new Error('Empty diagnostics response')
  return res
}

export type { StarterPingResult, StarterBootstrapResult, StarterDiagnosticsResult }
