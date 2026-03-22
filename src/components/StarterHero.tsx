import Button from '@splunk/react-ui/Button'
import Heading from '@splunk/react-ui/Heading'
import Paragraph from '@splunk/react-ui/Paragraph'
import type { StarterBootstrapResult, StarterDiagnosticsResult, StarterPingResult } from './StarterTypes'

type StarterHeroProps = {
  bootstrap?: StarterBootstrapResult
  diagnostics?: StarterDiagnosticsResult
  ping?: StarterPingResult
  loading: boolean
  hasError: boolean
}

function renderActionPills(items: string[]) {
  return (
    <div className="action-pills">
      {items.map((item) => (
        <Button key={item} appearance="secondary" label={item} disabled="disabled" />
      ))}
    </div>
  )
}

export function StarterHero({ bootstrap, diagnostics, ping, loading, hasError }: StarterHeroProps) {
  const statusLabel = hasError ? 'Needs attention' : loading ? 'Checking runtime' : 'Ready'
  const statusTone = hasError ? 'status-badge status-badge--error' : 'status-badge status-badge--ok'

  return (
    <header className="hero-card">
      <div className="hero-copy">
        <p className="eyebrow">Prompt to Splunk App</p>
        <Heading level={1}>Splunk App Generator Starter</Heading>
        <Paragraph className="lede">
          This starter is designed for IDE agents that take a plain-English requirement, generate a maintainable Splunk app, and keep the result installable.
        </Paragraph>
        {bootstrap ? renderActionPills(['Attach chat.md', 'Rename template', 'Run validate', 'Package app']) : null}
      </div>
      <div className="hero-status">
        <span className={statusTone}>{statusLabel}</span>
        <p className="meta-line">Backend roundtrip: {ping?.ok ? 'healthy' : loading ? 'pending' : 'not verified'}</p>
        {diagnostics ? <p className="meta-line">Resolved route: {diagnostics.path}</p> : null}
      </div>
    </header>
  )
}