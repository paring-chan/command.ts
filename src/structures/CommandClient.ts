import _ from 'lodash'
import { Registry } from './Registry'
import { Client, Message, Snowflake, User } from 'discord.js'
import { BuiltinCommandConverters, BuiltinSlashCommandConverters, CommandHandler } from '../builtinModules'
import { CoolDownAdapter, DefaultCoolDownAdapter } from '../command'
import { REST } from '@discordjs/rest'
import { Logger } from 'tslog'

export interface CommandOptions {
  prefix: string | ((msg: any) => string | Promise<string | string[]> | string[]) | string[]
  check: (msg: Message) => boolean | Promise<boolean>
}

export interface SlashCommandOptions {
  guild?: Snowflake | Snowflake[]
  autoSync: boolean
}

export interface CommandClientOptions {
  command: CommandOptions
  owners: 'auto' | Snowflake[]
  slashCommands: SlashCommandOptions
}

export interface CommandClientOptionsParam {
  command: Partial<CommandOptions>
  owners: 'auto' | string[]
  slashCommands: Partial<SlashCommandOptions>
}

export class CommandClient {
  options: CommandClientOptions
  owners: string[] = []
  registry = new Registry(this)
  client: Client
  coolDownAdapter: CoolDownAdapter
  rest = new REST({
    version: '9',
  })
  logger: Logger = new Logger({ name: 'Command.TS' })

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
    this.rest.setToken(this.client.token!)
    this._isReady = true
    if (this.options.owners === 'auto') {
      const owners = await this.fetchOwners()
      this.owners.push(...owners)
    }
    await this.registry.syncCommands()
  }

  constructor({ client, coolDownAdapter, ...options }: Partial<CommandClientOptionsParam> & { client: Client; coolDownAdapter?: CoolDownAdapter }) {
    this.client = client
    this.coolDownAdapter = coolDownAdapter || new DefaultCoolDownAdapter()
    this.options = _.merge<CommandClientOptions, Partial<CommandClientOptionsParam>>(
      {
        command: {
          prefix: '!',
          check: () => true,
        },
        owners: 'auto',
        slashCommands: {
          autoSync: true,
        },
      },
      options,
    )

    if (this.options.owners !== 'auto') {
      this.owners = this.options.owners
    }

    this.client.once('ready', () => this.ready())
    this.registry.registerModule(new CommandHandler(this.registry))
    this.registry.registerModule(new BuiltinCommandConverters(this))
    this.registry.registerModule(new BuiltinSlashCommandConverters(this))
  }
}
