export default function App() {
  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', padding: 20 }}>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Rich React Splunk Starter</div>
        <div style={{ marginTop: 8, color: '#94a3b8', fontSize: 14 }}>
          This richer layout is a blank canvas. Replace cards and panels with your app’s core workflow.
        </div>

        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10 }}>
          <div style={{ background: '#020617', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 12 }}>
            <div style={{ color: '#94a3b8', fontSize: 12 }}>Panel A</div>
            <div style={{ color: '#e2e8f0', fontWeight: 700 }}>Replace with domain data</div>
          </div>
          <div style={{ background: '#020617', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 12 }}>
            <div style={{ color: '#94a3b8', fontSize: 12 }}>Panel B</div>
            <div style={{ color: '#e2e8f0', fontWeight: 700 }}>Add your key action</div>
          </div>
          <div style={{ background: '#020617', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 12 }}>
            <div style={{ color: '#94a3b8', fontSize: 12 }}>Panel C</div>
            <div style={{ color: '#e2e8f0', fontWeight: 700 }}>Connect to backend route</div>
          </div>
        </div>
      </div>
    </div>
  )
}
