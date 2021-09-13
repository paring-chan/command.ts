import _ from 'lodash'
import { Registry } from './Registry'
import { Client, Message, User } from 'discord.js'
import { BuiltinCommandConverters, CommandHandler } from '../builtinModules'

export interface CommandOptions {
  prefix: string | ((msg: any) => string | Promise<string | string[]> | string[]) | string[]
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

  private _isReady = false

  private async fetchOwners(): Promise<string[]> {
    await this.client.application?.fetch()
    const o = this.client.application?.owner
    if (!o) return []
    if (o instanceof User) return [o.id]
    else return o.members.map((x) => x.id)
  }

  async ready() {
    if (this._isReady) return
    this._isReady = true
    if (this.options.owners === 'auto') {
      const owners = await this.fetchOwners()
      this.owners.push(...owners)
    }
  }

  constructor({ client, ...options }: Partial<CommandClientOptionsParam> & { client: Client }) {
    this.client = client
    this.options = _.merge<Partial<CommandClientOptionsParam>, CommandClientOptions>(options, {
      command: {
        prefix: '!',
      },
      owners: 'auto',
    })
    this.client.once('ready', () => this.ready())
    this.registry.registerModule(new CommandHandler(this.registry))
    this.registry.registerModule(new BuiltinCommandConverters(this))
  }
}
