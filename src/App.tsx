export default function App() {
  return (
    <div className="app-shell">
      <div className="surface-card">
        <h2 className="title">React Splunk App Template</h2>
        <p className="body-muted">
          This is a neutral starter screen. Replace this component with your app UI and wire your routes in the backend handler.
        </p>
        <ul className="list-muted">
          <li>Update this file to your domain-specific interface.</li>
          <li>Implement backend logic in <code>splunk_app/&lt;appId&gt;/bin/app_access.py</code>.</li>
          <li>Keep packaging flow: <code>npm run package:splunk</code>.</li>
        </ul>
      </div>
    </div>
  )
}
