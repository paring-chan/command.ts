import { Client, ClientOptions } from 'discord.js'
import { CommandClientOptions, Registry } from '..'

export class CommandClient extends Client {
  registry = new Registry(this)

  constructor(
    clientOptions: ClientOptions,
    public commandOptions: CommandClientOptions,
  ) {
    super(clientOptions)
  }
}
