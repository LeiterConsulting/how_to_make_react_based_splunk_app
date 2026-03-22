export type StarterPingResult = {
  ok: true
  app: string
  path: string
  method: string
}

export type StarterBootstrapResult = {
  ok: true
  app: {
    id: string
    host_view: string
    preferred_ui_framework: string
  }
  agent_context: {
    chat_context_file: string
    workspace_instructions_file: string
    prompt_file: string
    primary_docs: string[]
  }
  user_context: {
    user: string
    required_capability: string
    has_access: boolean
  }
  request_context: {
    path: string
    method: string
  }
  next_steps: string[]
}

export type StarterDiagnosticsResult = {
  ok: true
  component: string
  app: string
  path: string
  method: string
  required_capability: string
  has_access: boolean
  known_app_api_paths: string[]
  custom_controller_path: string
  preferred_ui_framework: string
}