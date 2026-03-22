import { useEffect, useState } from 'react'
import { getStarterBootstrap, getStarterDiagnostics, pingStarter } from './appClient'
import { StarterError, StarterHero, StarterPanels, type StarterBootstrapResult, type StarterDiagnosticsResult, type StarterPingResult } from './components'

type LoadState = {
  loading: boolean
  ping?: StarterPingResult
  bootstrap?: StarterBootstrapResult
  diagnostics?: StarterDiagnosticsResult
  error?: string
}

export default function App() {
  const [state, setState] = useState<LoadState>({ loading: true })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        // REVIEW: Keep the starter UI focused on runtime health and handoff guidance.
        const [ping, bootstrap, diagnostics] = await Promise.all([
          pingStarter(),
          getStarterBootstrap(),
          getStarterDiagnostics(),
        ])

        if (cancelled) return
        setState({ loading: false, ping, bootstrap, diagnostics })
      } catch (error) {
        if (cancelled) return
        setState({
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown runtime error',
        })
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const bootstrap = state.bootstrap
  const diagnostics = state.diagnostics

  return (
    <div className="app-shell">
      <StarterHero bootstrap={bootstrap} diagnostics={diagnostics} ping={state.ping} loading={state.loading} hasError={Boolean(state.error)} />
      <StarterPanels bootstrap={bootstrap} diagnostics={diagnostics} />
      {state.error ? <StarterError error={state.error} /> : null}
    </div>
  )
}
