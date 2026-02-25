export default function App() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 20 }}>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 20 }}>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>React Splunk App Template</h2>
        <p style={{ color: '#94a3b8', marginTop: 0 }}>
          This is a neutral starter screen. Replace this component with your app UI and wire your routes in the backend handler.
        </p>
        <ul style={{ margin: '12px 0 0 18px', color: '#cbd5e1' }}>
          <li>Update this file to your domain-specific interface.</li>
          <li>Implement backend logic in <code>splunk_app/&lt;appId&gt;/bin/app_access.py</code>.</li>
          <li>Keep packaging flow: <code>npm run package:splunk</code>.</li>
        </ul>
      </div>
    </div>
  )
}
