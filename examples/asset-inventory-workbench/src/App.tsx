import Button from '@splunk/react-ui/Button'
import Card from '@splunk/react-ui/Card'
import Heading from '@splunk/react-ui/Heading'
import Paragraph from '@splunk/react-ui/Paragraph'
import Table from '@splunk/react-ui/Table'

const SAMPLE_ROWS = [
  { id: 'asset-001', name: 'payments-api', owner: 'platform-team', status: 'healthy' },
  { id: 'asset-002', name: 'crm-worker', owner: 'customer-systems', status: 'needs-review' },
]

export default function App() {
  return (
    <div className="app-shell">
      <header className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Generated Example</p>
          <Heading level={1}>Asset Inventory Workbench</Heading>
          <Paragraph className="lede">
            This is an example generated surface for a KV-backed asset inventory workflow. It shows the shape of a custom Splunk UI page after prompt-driven generation.
          </Paragraph>
        </div>
      </header>

      <section className="panel-grid">
        <Card className="panel-card panel-card--wide">
          <Card.Header title="Inventory actions" subtitle="Operator workflow" />
          <Card.Body>
            <div className="action-pills">
              <Button appearance="primary" label="Add asset" disabled="disabled" />
              <Button appearance="secondary" label="Edit selected asset" disabled="disabled" />
              <Button appearance="destructiveSecondary" label="Delete selected asset" disabled="disabled" />
            </div>
          </Card.Body>
        </Card>

        <Card className="panel-card panel-card--wide">
          <Card.Header title="Asset records" subtitle="Example generated table" />
          <Card.Body>
            <Table stripeRows>
              <Table.Head>
                <Table.HeadCell>ID</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Owner</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {SAMPLE_ROWS.map((row) => (
                  <Table.Row key={row.id}>
                    <Table.Cell>{row.id}</Table.Cell>
                    <Table.Cell>{row.name}</Table.Cell>
                    <Table.Cell>{row.owner}</Table.Cell>
                    <Table.Cell>{row.status}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card.Body>
        </Card>
      </section>
    </div>
  )
}