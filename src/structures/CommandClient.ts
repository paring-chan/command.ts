import _ from 'lodash'
import { Registry } from './Registry'
import { Client, User } from 'discord.js'
import { BuiltinCommandConverters, CommandHandler } from '../builtinModules'
import { CoolDownAdapter, DefaultCoolDownAdapter } from '../command'

export interface CommandOptions {
  prefix: string | ((msg: any) => string | Promise<string | string[]> | string[]) | string[]
}

export interface SlashCommandOptions {
  guild?: string | string[]
  autoSync: boolean
}

export interface CommandClientOptions {
  command: CommandOptions
  owners: 'auto' | string[]
  slashCommands: SlashCommandOptions
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
  coolDownAdapter: CoolDownAdapter

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

  constructor({ client, coolDownAdapter, ...options }: Partial<CommandClientOptionsParam> & { client: Client; coolDownAdapter?: CoolDownAdapter }) {
    this.client = client
    this.coolDownAdapter = coolDownAdapter || new DefaultCoolDownAdapter()
    this.options = _.merge<Partial<CommandClientOptionsParam>, CommandClientOptions>(options, {
      command: {
        prefix: '!',
      },
      owners: 'auto',
      slashCommands: {
        autoSync: true,
      },
    })
    this.client.once('ready', () => this.ready())
    this.registry.registerModule(new CommandHandler(this.registry))
    this.registry.registerModule(new BuiltinCommandConverters(this))
  }
}
