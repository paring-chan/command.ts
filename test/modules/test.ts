import { command, CommandClient, coolDown, CoolDownError, CoolDownType, listener, Module, option, rest, slashCommand } from '../../src'
import { CommandInteraction, Message } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { ownerOnly } from '../../dist'

class Test extends Module {
  constructor(private client: CommandClient) {
    super()
  }

  load() {
    console.log('load')
  }

  unload() {
    console.log('unload')
  }

  beforeReload() {
    console.log('before reload')
  }

  afterReload() {
    console.log('after reload')
  }

  @listener('ready')
  ready() {
    console.log(`Logged in as ${this.client.client.user!.tag}`)
  }

  @listener('commandError')
  error(err: Error, msg: Message) {
    if (err instanceof CoolDownError) {
      return msg.reply(`쿨다운: <t:${(err.endsAt.getTime() / 1000).toFixed(0)}:R>`)
    }
    console.error(err)
  }
  @listener('slashCommandError')
  slashCommandError(err: Error, msg: CommandInteraction) {
    if (err instanceof CoolDownError) {
      return msg.reply({
        content: `쿨다운: <t:${(err.endsAt.getTime() / 1000).toFixed(0)}:R>`,
        ephemeral: true,
      })
    }
    console.error(err)
  }

  @command()
  @coolDown(CoolDownType.USER, 10)
  test(msg: Message, @rest asdf: string = 'wa sans') {
    msg.reply(asdf)
  }

  @slashCommand({
    command: new SlashCommandBuilder()
      .setName('test')
      .setDescription('test command')
      .addStringOption((builder) => builder.setName('test').setDescription('test option').setRequired(false)),
  })
  @coolDown(CoolDownType.USER, 10)
  async testSlash(i: CommandInteraction, @option('test') test: string = 'wa sans') {
    return i.reply({
      content: test,
    })
  }

  @slashCommand({
    command: new SlashCommandBuilder().setName('reload').setDescription('리로드 커맨드'),
  })
  @ownerOnly
  async reload(i: CommandInteraction) {
    const data = await this.client.registry.reloadAll()
    console.log(data)
    await i.reply({
      ephemeral: true,
      content: '```\n' + data.map((x) => (x.success ? `✅ ${x.path}` : `❌ ${x.path}\n${x.error}`)).join('\n') + '```',
    })
  }
}

export function install(client: CommandClient) {
  return new Test(client)
}
