import { Client, ClientOptions } from 'discord.js'
import { CommandClientOptions } from '..'

export class CommandClient extends Client {
  constructor(
    clientOptions: ClientOptions,
    public commandOptions: CommandClientOptions,
  ) {
    super(clientOptions)
  }
}
