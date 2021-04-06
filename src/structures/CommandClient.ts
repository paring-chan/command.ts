import { Client, ClientOptions } from 'discord.js'
import { CommandClientOptions, Registry } from '..'
import { CommandHandler } from '../defaultModules/CommandHandler'

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
    this.registry.registerModule('commandHandler', new CommandHandler(this))
  }
}
