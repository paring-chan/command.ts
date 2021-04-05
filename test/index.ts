import Discord from 'discord.js'
import { command, CommandClient, Context, Module } from '../dist'

class TestModule extends Module {
  @command()
  async test(ctx: Context, test: string) {
    console.log(test)
  }
}

const client = new CommandClient(
  {
    intents: Discord.Intents.ALL,
  },
  {},
)
