import Card from '@splunk/react-ui/Card'
import Heading from '@splunk/react-ui/Heading'
import Paragraph from '@splunk/react-ui/Paragraph'

export default function App() {
  return (
    <div className="app-shell">
      <header className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Dashboard-First Variant</p>
          <Heading level={1}>Operations Overview Starter</Heading>
          <Paragraph className="lede">
            Use this variant when the prompt is mainly about dashboards, saved searches, filters, and drilldowns rather than a large custom workflow.
          </Paragraph>
        </div>
      </header>

      <section className="panel-grid">
        <Card className="panel-card panel-card--wide">
          <Card.Header title="Primary dashboard goals" subtitle="Replace these with operator questions" />
          <Card.Body>
            <ul className="ordered-list">
              <li>What changed in service health during the selected time window?</li>
              <li>Which entities need immediate action?</li>
              <li>Where should drilldown navigation send the user next?</li>
            </ul>
          </Card.Body>
        </Card>

        <Card className="panel-card">
          <Card.Header title="Saved search" subtitle="Native search object first" />
          <Card.Body>
            <Paragraph className="panel-copy">Add the SPL, time range defaults, and dashboard tokens that define the view.</Paragraph>
          </Card.Body>
        </Card>

        <Card className="panel-card">
          <Card.Header title="Drilldown" subtitle="Action target" />
          <Card.Body>
            <Paragraph className="panel-copy">Wire panel clicks to the next dashboard, search, or app route.</Paragraph>
          </Card.Body>
        </Card>
      </section>
    </div>
  )
}