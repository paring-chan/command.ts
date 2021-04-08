import { Client, ClientOptions } from 'discord.js'
import {
  CommandClientOptions,
  Registry,
  CommandHandler,
  BuiltInConverters,
} from '..'

export class CommandClient extends Client {
  registry = new Registry(this)
  commandOptions: CommandClientOptions

  constructor(
    clientOptions: ClientOptions,
    commandOptions: Partial<CommandClientOptions>,
  ) {
    super(clientOptions)
    this.commandOptions = {
      owners: commandOptions.owners || 'auto',
      prefix: commandOptions.prefix || '!',
    }
    this.registry.registerModule(new CommandHandler(this))
    this.registry.registerModule(new BuiltInConverters(this))
  }
}
