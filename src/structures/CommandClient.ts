import { HandlerAdapter } from '../interface'
import _ from 'lodash'

export interface CommandOptions {
  prefix: string | ((msg: any) => string)
}

export interface CommandClientOptions {
  command: Partial<CommandOptions>
  owners: 'auto' | string[]
}

export class CommandClient {
  adapter: HandlerAdapter<any>
  options: CommandClientOptions
  owners: string[] = []

  handle(msg: any) {
    const data = this.adapter.getCommandData(msg)
  }

  private _isReady = false

  async ready() {
    if (this._isReady) return
    this._isReady = true
    if (this.options.owners === 'auto') {
      const owners = await this.adapter.fetchOwners()
      this.owners.push(...owners)
    }
  }

  constructor({
    adapter,
    ...options
  }: Partial<CommandClientOptions> & { adapter: HandlerAdapter<any> }) {
    this.adapter = adapter
    this.options = _.merge<Partial<CommandClientOptions>, CommandClientOptions>(
      options,
      {
        command: {
          prefix: '!',
        },
        owners: 'auto',
      },
    )
    adapter.init(this)
  }
}
