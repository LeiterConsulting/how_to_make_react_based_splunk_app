import Button from '@splunk/react-ui/Button'
import Card from '@splunk/react-ui/Card'
import Heading from '@splunk/react-ui/Heading'
import Paragraph from '@splunk/react-ui/Paragraph'

export default function App() {
  return (
    <div className="app-shell">
      <header className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">REST CRUD Variant</p>
          <Heading level={1}>Entity Management Starter</Heading>
          <Paragraph className="lede">
            Use this variant when the prompt calls for explicit create, read, update, and delete operations over structured app data.
          </Paragraph>
        </div>
      </header>

      <section className="panel-grid">
        <Card className="panel-card panel-card--wide">
          <Card.Header title="Collection workflow" subtitle="Start with explicit operator actions" />
          <Card.Body>
            <div className="action-pills">
              <Button appearance="primary" label="Create entity" disabled="disabled" />
              <Button appearance="secondary" label="Edit entity" disabled="disabled" />
              <Button appearance="destructiveSecondary" label="Delete entity" disabled="disabled" />
            </div>
            <Paragraph className="panel-copy">Replace the disabled actions with the real form flow once the persistence model and route contract are defined.</Paragraph>
          </Card.Body>
        </Card>

        <Card className="panel-card">
          <Card.Header title="Persistence" subtitle="Choose on purpose" />
          <Card.Body>
            <Paragraph className="panel-copy">Use KV Store for app-managed records, lookups for tables, or conf files for low-volume configuration.</Paragraph>
          </Card.Body>
        </Card>

        <Card className="panel-card">
          <Card.Header title="Handler contract" subtitle="Keep it narrow" />
          <Card.Body>
            <Paragraph className="panel-copy">Add one handler per workflow boundary and return predictable JSON for each action.</Paragraph>
          </Card.Body>
        </Card>
      </section>
    </div>
  )
}