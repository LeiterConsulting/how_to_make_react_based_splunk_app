export default function App() {
  return (
    <div className="app-shell" style={{ maxWidth: 1160 }}>
      <div className="surface-card">
        <div style={{ fontSize: 20, fontWeight: 700 }}>Rich React Splunk Starter</div>
        <div className="body-muted" style={{ marginTop: 8, fontSize: 14 }}>
          This richer layout is a blank canvas. Replace cards and panels with your app’s core workflow.
        </div>

        <div className="grid-panels">
          <div className="panel">
            <div className="panel-label">Panel A</div>
            <div className="panel-title">Replace with domain data</div>
          </div>
          <div className="panel">
            <div className="panel-label">Panel B</div>
            <div className="panel-title">Add your key action</div>
          </div>
          <div className="panel">
            <div className="panel-label">Panel C</div>
            <div className="panel-title">Connect to backend route</div>
          </div>
        </div>
      </div>
    </div>
  )
}
