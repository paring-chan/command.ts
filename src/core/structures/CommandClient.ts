import chalk from 'chalk'
import { Client } from 'discord.js'
import EventEmitter from 'events'
import { Logger } from 'tslog'
import { ApplicationCommandExtension, ApplicationCommandExtensionConfig } from '../../applicationCommand/ApplicationCommandExtension'
import { CommandClientSymbol } from '../symbols'
import { Registry } from './Registry'

export class CommandClient extends EventEmitter {
  ctsLogger: Logger
  registry: Registry

  constructor(public discord: Client, public logger: Logger = new Logger({ dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone })) {
    super()

    this.ctsLogger = logger.getChildLogger({ prefix: [chalk.blue('[command.ts]')], displayFilePath: 'hidden', displayFunctionName: false })

    this.registry = new Registry(this.ctsLogger, this)

    this.registry.registerEventEmitter('cts', this)
    this.registry.registerEventEmitter('discord', this.discord)
  }

  async enableApplicationCommandsExtension(config: ApplicationCommandExtensionConfig) {
    await this.registry.registerModule(new ApplicationCommandExtension(config))
    this.ctsLogger.info('Application command extension enabled.')
  }

  getApplicationCommandsExtension() {
    return this.registry.extensions.find((x) => x.constructor === ApplicationCommandExtension) as ApplicationCommandExtension | undefined
  }

  static getFromModule(ext: object): CommandClient {
    return Reflect.getMetadata(CommandClientSymbol, ext)
  }
}
