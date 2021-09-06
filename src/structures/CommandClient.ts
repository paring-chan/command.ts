import _ from 'lodash'
import { Registry } from './Registry'
import { Client, Message, User } from 'discord.js'

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
  options: CommandClientOptions
  owners: string[] = []
  registry = new Registry(this)
  client: Client

  private async handle(msg: Message) {
    const prefixList: string[] | string =
      typeof this.options.command.prefix === 'string'
        ? this.options.command.prefix
        : typeof this.options.command.prefix === 'function'
        ? await this.options.command.prefix(msg)
        : this.options.command.prefix
    let prefix: string
    if (typeof prefixList === 'object') {
      const res = prefixList.find((x) => msg.content.includes(x))

      if (!res) return

      prefix = res
    } else {
      if (!msg.content.includes(prefixList)) return
      prefix = prefixList
    }

    const args = msg.content.slice(prefix.length).split(' ')

    const command = args.shift()

    if (!command) return

    this.registry.commands

    console.log(command)
    console.log(args)
  }

  private _isReady = false

  private fetchOwners(): string[] {
    const o = this.client.application?.owner
    if (!o) return []
    if (o instanceof User) return [o.id]
    else return o.members.map((x) => x.id)
  }

  async ready() {
    if (this._isReady) return
    this._isReady = true
    if (this.options.owners === 'auto') {
      const owners = this.fetchOwners()
      this.owners.push(...owners)
    }
  }

  constructor({
    client,
    ...options
  }: Partial<CommandClientOptionsParam> & { client: Client }) {
    this.client = client
    this.options = _.merge<
      Partial<CommandClientOptionsParam>,
      CommandClientOptions
    >(options, {
      command: {
        prefix: '!',
      },
      owners: 'auto',
    })

    this.client.on('messageCreate', (msg) => this.handle(msg))
    this.client.once('ready', this.ready)
  }
}
