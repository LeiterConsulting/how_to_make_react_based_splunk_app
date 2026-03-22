import Message from '@splunk/react-ui/Message'

type StarterErrorProps = {
  error: string
}

export function StarterError({ error }: StarterErrorProps) {
  return (
    <Message className="error-card" type="error" appearance="fill">
      <Message.Title>Runtime error</Message.Title>
      <pre>{error}</pre>
    </Message>
  )
}