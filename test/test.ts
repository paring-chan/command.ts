import {
  command,
  CommandClient,
  listener,
  Module,
  ownerOnly,
  rest,
  DebugModule,
  Context,
  slashCommand,
} from '../src'
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  Message,
} from 'discord.js'

export class TestModule extends Module {
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

  @ownerOnly
  @command({ name: '리로드', aliases: ['reload', 'rl'] })
  async reload(msg: Message) {
    const modules = this.client.registry.modules
      .filter((x) => x.__path.startsWith(__dirname))
      .values()
    let result = '```\n'
    let success = 0
    let failed = 0
    for (const module of modules) {
      try {
        await this.client.registry.reloadModule(module)
        result += `✅ ${module.constructor.name}\n`
        success++
      } catch {
        result += `🚫 ${module.constructor.name}\n`
        failed++
      }
    }
    result += `\`\`\`\n${success} successful, ${failed} failed.`
    await msg.reply(result)
  }

  @command()
  @ownerOnly
  test(msg: Context) {
    return DebugModule.run(msg)
  }

  @slashCommand({
    name: 'sans',
    options: [
      {
        name: 'wa',
        description: '샌즈!',
        type: 'STRING',
        required: true,
      },
    ],
    description: '와 샌즈!',
  })
  sans(i: CommandInteraction, options: CommandInteractionOptionResolver) {
    i.reply({
      content: `와! ${options.getString('wa')}! 아시는구나!`,
      ephemeral: true,
    })
  }

  unload() {
    delete require.cache[require.resolve('../src')]
    delete require.cache[require.resolve('../src/debugTool/DebugModule')]
    delete require.cache[require.resolve('../src/debugTool')]
    delete require.cache[require.resolve('../src/debugTool/commands')]
    delete require.cache[require.resolve('../src/debugTool/commands/default')]
    delete require.cache[require.resolve('../src/debugTool/commands')]
    delete require.cache[require.resolve('../src/debugTool/commands/eval')]
    delete require.cache[require.resolve('../src/debugTool/commands/load')]
    delete require.cache[require.resolve('../src/debugTool/commands/reload')]
    delete require.cache[require.resolve('../src/debugTool/commands/unload')]
    delete require.cache[require.resolve('../src/debugTool/commands/shell')]
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

export function install(client: CommandClient) {
  return new TestModule(client)
}
