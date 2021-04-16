import {
  Client,
  ClientApplication,
  ClientOptions,
  Team,
  User,
} from 'discord.js'
import {
  CommandClientOptions,
  Registry,
  CommandHandler,
  BuiltInConverters,
} from '..'

export class CommandClient extends Client {
  registry = new Registry(this)
  commandOptions: CommandClientOptions
  owners: string[] = []

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

  async login(token?: string): Promise<string> {
    const res = await super.login(token)
    if (this.commandOptions.owners === 'auto') {
      const app =
        // @ts-ignore
        this.application! ||
        //@ts-ignore
        (await this.fetchApplication())
      if (app.owner instanceof Team) {
        this.owners = app.owner.members.map((x) => x.id)
      } else if (app.owner instanceof User) {
        this.owners = [app.owner.id]
      }
    } else {
      this.owners = this.commandOptions.owners
    }
    return res
  }
}
