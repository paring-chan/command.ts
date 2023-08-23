import chalk from 'chalk'
import type { Client, Snowflake } from 'discord.js'
import { Team, User } from 'discord.js'
import EventEmitter from 'events'
import type { ISettingsParam } from 'tslog'
import { Logger } from 'tslog'
import type { ApplicationCommandExtensionConfig } from '../../applicationCommand/ApplicationCommandExtension'
import { ApplicationCommandExtension } from '../../applicationCommand/ApplicationCommandExtension'
import type { TextCommandConfig } from '../../textCommand'
import { TextCommandExtension } from '../../textCommand/TextCommandExtension'
import { CommandClientSymbol } from '../symbols'
import { Registry } from './Registry'
export class CommandClient extends EventEmitter {
  ctsLogger: Logger<unknown>
  registry: Registry

  owners: Set<Snowflake> = new Set()

  constructor(
    public discord: Client,
    public logger: Logger<unknown> = new Logger({ prettyLogTimeZone: 'local' }),
    loggerOptions: ISettingsParam<unknown> = {},
  ) {
    super()

    this.ctsLogger = logger.getSubLogger({
      ...loggerOptions,
      name: 'command.ts',
    })

    this.registry = new Registry(this.ctsLogger, this)

    this.registry.registerEventEmitter('cts', this)
    this.registry.registerEventEmitter('discord', this.discord)
  }

  async isOwner(user: User): Promise<boolean> {
    return this.owners.has(user.id)
  }

  async fetchOwners() {
    if (!this.discord.application) throw new Error('The client is not logged in.')

    this.ctsLogger.info('Fetching owners...')

    await this.discord.application.fetch()

    const owner = this.discord.application.owner

    if (!owner) throw new Error('Cannot find application owner')

    const owners: string[] = []

    if (owner instanceof User) {
      this.owners.add(owner.id)
      owners.push(owner.tag)
    } else if (owner instanceof Team) {
      for (const [id, member] of owner.members) {
        this.owners.add(id)
        owners.push(member.user.tag)
      }
    }

    this.ctsLogger.info(`Fetched ${chalk.green(owners.length)} owners(${owners.map((x) => chalk.blue(x)).join(', ')})`)
  }

  async enableApplicationCommandsExtension(config: ApplicationCommandExtensionConfig) {
    await this.registry.registerModule(new ApplicationCommandExtension(config))
    this.ctsLogger.info('Application command extension enabled.')
  }

  async enableTextCommandsExtension(config: TextCommandConfig) {
    await this.registry.registerModule(new TextCommandExtension(config))
    this.ctsLogger.info('Text command extension enabled.')
  }

  getApplicationCommandsExtension() {
    return this.registry.extensions.find((x) => x.constructor === ApplicationCommandExtension) as ApplicationCommandExtension | undefined
  }

  static getFromModule(ext: object): CommandClient {
    return Reflect.getMetadata(CommandClientSymbol, ext)
  }
}
