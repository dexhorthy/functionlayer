import { AgentBackend, AgentStore, HumanLayerException } from './protocol'
import { FunctionCall, FunctionCallStatus, HumanContact, HumanContactStatus } from './models'

class HumanLayerCloudConnection {
  apiKey?: string
  apiBaseURL?: string
  httpTimeoutSeconds: number

  constructor(api_key?: string, api_base_url?: string, http_timeout_seconds: number = 10) {
    this.apiKey = api_key
    this.apiBaseURL = api_base_url
    this.httpTimeoutSeconds = http_timeout_seconds

    if (!this.apiKey) {
      throw new Error('HUMANLAYER_API_KEY is required for cloud approvals')
    }
    this.apiBaseURL = this.apiBaseURL || 'https://api.humanlayer.dev/humanlayer/v1'
    // todo ping api to validate token
  }

  async request({
    method,
    path,
    body,
  }: {
    method: string
    path: string
    body?: any
  }): Promise<Response> {
    const resp = await fetch(`${this.apiBaseURL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (resp.status >= 400) {
      const err = new HumanLayerException(`${method} ${path} ${resp.status}: ${await resp.text()}`)
      throw err
    }
    return resp
  }
}

class CloudFunctionCallStore implements AgentStore<FunctionCall, FunctionCallStatus> {
  private connection: HumanLayerCloudConnection

  constructor(connection: HumanLayerCloudConnection) {
    this.connection = connection
  }

  async add(item: FunctionCall): Promise<FunctionCall> {
    const resp = await this.connection.request({
      method: 'POST',
      path: '/function_calls',
      body: item,
    })
    const data = await resp.json()
    return data as FunctionCall
  }

  async get(call_id: string): Promise<FunctionCall> {
    const resp = await this.connection.request({
      method: 'GET',
      path: `/function_calls/${call_id}`,
    })
    const data = await resp.json()
    return data as FunctionCall
  }

  async respond(call_id: string, status: FunctionCallStatus): Promise<FunctionCall> {
    const resp = await this.connection.request({
      method: 'POST',
      path: `/agent/function_calls/${call_id}/respond`,
      body: status,
    })
    const data = await resp.json()
    return data as FunctionCall
  }
}

class CloudHumanContactStore implements AgentStore<HumanContact, HumanContactStatus> {
  private connection: HumanLayerCloudConnection

  constructor(connection: HumanLayerCloudConnection) {
    this.connection = connection
  }

  async add(item: HumanContact): Promise<HumanContact> {
    const resp = await this.connection.request({
      method: 'POST',
      path: '/contact_requests',
      body: item,
    })
    const data = await resp.json()
    return data as HumanContact
  }

  async get(call_id: string): Promise<HumanContact> {
    const resp = await this.connection.request({
      method: 'GET',
      path: `/contact_requests/${call_id}`,
    })
    const data = await resp.json()
    return data as HumanContact
  }

  async respond(call_id: string, status: HumanContactStatus): Promise<HumanContact> {
    const resp = await this.connection.request({
      method: 'POST',
      path: `/agent/human_contacts/${call_id}/respond`,
      body: status,
    })
    const data = await resp.json()
    return data as HumanContact
  }
}

class CloudHumanLayerBackend implements AgentBackend {
  public connection: HumanLayerCloudConnection
  private _function_calls: CloudFunctionCallStore
  private _human_contacts: CloudHumanContactStore

  constructor(connection: HumanLayerCloudConnection) {
    this.connection = connection
    this._function_calls = new CloudFunctionCallStore(connection)
    this._human_contacts = new CloudHumanContactStore(connection)
  }

  functions(): CloudFunctionCallStore {
    return this._function_calls
  }

  contacts(): CloudHumanContactStore {
    return this._human_contacts
  }
}

export {
  HumanLayerCloudConnection,
  CloudFunctionCallStore,
  CloudHumanContactStore,
  CloudHumanLayerBackend,
}
