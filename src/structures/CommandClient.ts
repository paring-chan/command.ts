import { HandlerAdapter } from '../interface'
import _ from 'lodash'
import { Registry } from './Registry'

export interface CommandOptions {
  prefix:
    | string
    | ((msg: any) => string | Promise<string | string[]> | string[])
    | string[]
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
  registry = new Registry(this)

  async handle(msg: any) {
    const data = this.adapter.getCommandData(msg)
    const prefixList: string[] | string =
      typeof this.options.command.prefix === 'string'
        ? this.options.command.prefix
        : typeof this.options.command.prefix === 'function'
        ? await this.options.command.prefix(msg)
        : this.options.command.prefix
    let prefix: string
    if (typeof prefixList === 'object') {
      const res = prefixList.find((x) => data.content.includes(x))

      if (!res) return

      prefix = res
    } else {
      if (!data.content.includes(prefixList)) return
      prefix = prefixList
    }

    const args = data.content.slice(prefix.length).split(' ')

    const command = args.shift()

    if (!command) return

    this.registry.commands

    console.log(command)
    console.log(args)
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
