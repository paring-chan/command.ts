import Discord from 'discord.js'
import { command, CommandClient, Context, listener, Module } from '../dist'

class TestModule extends Module {
  constructor(private client: CommandClient) {
    super()
  }

  @listener('ready')
  async ready() {
    console.log(`Logged in as ${this.client.user!.tag}`)
  }
}

const client = new CommandClient(
  {
    intents: Discord.Intents.ALL,
  },
  {},
)

client.registry.registerModule('test', new TestModule(client))
