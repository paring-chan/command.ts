import Discord, { Message, User } from 'discord.js'
import { command, CommandClient, listener, Module } from '../dist'
// @ts-ignore
import config from './config.json'

class TestModule extends Module {
  constructor(private client: CommandClient) {
    super()
  }

  @listener('ready')
  async ready() {
    console.log(`Logged in as ${this.client.user!.tag}`)
  }

  @listener('commandError')
  async commandError(err: Error) {
    console.error(err)
  }

  @command()
  async test(msg: Message, test: string) {
    await msg.reply(test, {
      allowedMentions: {
        repliedUser: false,
      },
    })
  }

  @command()
  async test2(msg: Message, test: User) {
    await msg.reply(test.tag, {
      allowedMentions: {
        repliedUser: false,
      },
    })
  }
}

const client = new CommandClient(
  {
    intents: Discord.Intents.ALL,
  },
  {},
)

client.registry.registerModule('test', new TestModule(client))

client.login(config.token)
