// @ts-ignore
import config from './config.json'
import {
  ApplicationCommandOptionData,
  CommandInteraction,
  CommandInteractionOption,
  Interaction,
  Message,
} from 'discord.js'
import {
  command,
  ownerOnly,
  rest,
  slashCommand,
  CommandClient,
  listener,
  Module,
} from '../src'

class TestModule extends Module {
  constructor(private client: CommandClient) {
    super(__filename)
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
  @ownerOnly
  async eval(msg: Message, @rest code: string) {
    await msg.reply({
      content: await new Promise((resolve) => resolve(eval(code)))
        .then((value) => require('util').inspect(value))
        .catch((e) => e.message),
    })
  }

  @slashCommand({
    name: 'test',
    description: '테스트',
    options: [
      {
        type: 'STRING',
        name: 'test',
        description: '와! <test>',
        required: true,
      },
    ],
  })
  async test(i: CommandInteraction, test: CommandInteractionOption) {
    await i.reply({
      content: `와! ${test.value}!`,
    })
  }

  // @command()
  // async test(msg: Message, @rest test: string) {
  //   await msg.reply(test, {
  //     allowedMentions: {
  //       repliedUser: false,
  //     },
  //   })
  // }
  //
  // @command()
  // async test2(msg: Message, test: User) {
  //   await msg.reply(test.tag, {
  //     allowedMentions: {
  //       repliedUser: false,
  //     },
  //   })
  // }
}

const client = new CommandClient(
  {
    intents: [
      'GUILDS',
      'GUILD_MEMBERS',
      'GUILD_BANS',
      'GUILD_EMOJIS',
      'GUILD_INTEGRATIONS',
      'GUILD_WEBHOOKS',
      'GUILD_INVITES',
      'GUILD_VOICE_STATES',
      'GUILD_PRESENCES',
      'GUILD_MESSAGES',
      'GUILD_MESSAGE_REACTIONS',
      'GUILD_MESSAGE_TYPING',
      'DIRECT_MESSAGES',
      'DIRECT_MESSAGE_REACTIONS',
      'DIRECT_MESSAGE_TYPING',
    ],
    partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'USER', 'REACTION'],
  },
  {
    prefix: '!test ',
    slashCommands: {
      guild: '866250605815136276',
      autoRegister: true,
    },
  },
)

client.registry.registerModule(new TestModule(client))

client.login(config.token)
