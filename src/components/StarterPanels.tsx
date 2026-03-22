import Card from '@splunk/react-ui/Card'
import Paragraph from '@splunk/react-ui/Paragraph'
import WaitSpinner from '@splunk/react-ui/WaitSpinner'
import { StarterList } from './StarterLists'
import type { StarterBootstrapResult, StarterDiagnosticsResult } from './StarterTypes'

type StarterPanelsProps = {
  bootstrap?: StarterBootstrapResult
  diagnostics?: StarterDiagnosticsResult
}

export function StarterPanels({ bootstrap, diagnostics }: StarterPanelsProps) {
  return (
    <section className="panel-grid">
      <Card className="panel-card panel-card--wide">
        <Card.Header title="Agent context pack" subtitle="Files an IDE agent should read first" />
        <Card.Body>
          <Paragraph className="panel-copy">
            Start each implementation run by attaching <code>chat.md</code> to the chat session, then invoke the workspace prompt or paste your own request.
          </Paragraph>
          {bootstrap ? (
            <StarterList
              className="ordered-list"
              items={[
                `Attach ${bootstrap.agent_context.chat_context_file} to the chat session.`,
                `Load workspace instructions from ${bootstrap.agent_context.workspace_instructions_file}.`,
                `Use ${bootstrap.agent_context.prompt_file} when you want a ready-made implementation prompt.`,
              ]}
            />
          ) : null}
        </Card.Body>
      </Card>

      <Card className="panel-card">
        <Card.Header title="Starter workflow" subtitle="Keep the generated app installable" />
        <Card.Body>
          {bootstrap ? <StarterList className="ordered-list" items={bootstrap.next_steps} /> : <WaitSpinner size="medium" screenReaderText="Loading workflow guidance" />}
        </Card.Body>
      </Card>

      <Card className="panel-card">
        <Card.Header title="Preferred UI surface" subtitle="Framework choice for custom pages" />
        <Card.Body>
          <p className="value-pill">{bootstrap?.app.preferred_ui_framework ?? 'splunk-ui-react'}</p>
          <Paragraph className="panel-copy">
            Prefer Splunk UI Framework components whenever a custom React surface is justified. Fall back to plain React only when the framework does not cover the use case.
          </Paragraph>
        </Card.Body>
      </Card>

      <Card className="panel-card panel-card--wide">
        <Card.Header title="Runtime diagnostics" subtitle="Use these values when smoke tests fail" />
        <Card.Body>
          {diagnostics ? (
            <div className="diagnostics-grid">
              <div>
                <span className="label">App ID</span>
                <p>{diagnostics.app}</p>
              </div>
              <div>
                <span className="label">Capability gate</span>
                <p>{diagnostics.required_capability || 'none'}</p>
              </div>
              <div>
                <span className="label">Custom controller path</span>
                <p>{diagnostics.custom_controller_path}</p>
              </div>
              <div>
                <span className="label">Known API paths</span>
                <StarterList items={diagnostics.known_app_api_paths} />
              </div>
            </div>
          ) : (
            <WaitSpinner size="medium" screenReaderText="Loading diagnostics" />
          )}
        </Card.Body>
      </Card>

      <Card className="panel-card panel-card--wide">
        <Card.Header title="Developer review notes" subtitle="Keep the starter generic" />
        <Card.Body>
          {bootstrap ? <StarterList items={bootstrap.agent_context.primary_docs} /> : null}
          <Paragraph className="panel-copy">
            Keep this screen generic. Domain-specific dashboards, searches, REST handlers, and storage choices belong in the generated app implementation, not in the starter shell.
          </Paragraph>
        </Card.Body>
      </Card>
    </section>
  )
}