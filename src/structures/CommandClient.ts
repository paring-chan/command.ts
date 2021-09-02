import { HandlerAdapter } from '../interface'
import _ from 'lodash'

export interface CommandOptions {
  prefix: string | ((msg: any) => string)
}

export interface CommandClientOptions {
  command: CommandOptions
  owners: 'auto' | string[]
}

export interface CommandClientOptionsParam {
  command: Partial<CommandOptions>
  owners: 'auto' | string[]
}

export class CommandClient {
  adapter: HandlerAdapter<any>
  options: CommandClientOptions
  owners: string[] = []

  async handle(msg: any) {
    const data = this.adapter.getCommandData(msg)
    const prefix =
      typeof this.options.command.prefix === 'string'
        ? this.options.command.prefix
        : await this.options.command.prefix(msg)
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
  }: Partial<CommandClientOptionsParam> & { adapter: HandlerAdapter<any> }) {
    this.adapter = adapter
    this.options = _.merge<
      Partial<CommandClientOptionsParam>,
      CommandClientOptions
    >(options, {
      command: {
        prefix: '!',
      },
      owners: 'auto',
    })
    adapter.init(this)
  }
}
