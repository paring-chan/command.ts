import { command, CommandClient, coolDown, CoolDownError, CoolDownType, listener, Module, rest, slashCommand } from '../../src'
import { CommandInteraction, Message } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

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
  async testSlash(i: CommandInteraction) {
    return i.reply('test')
  }
}

export function install(client: CommandClient) {
  return new Test(client)
}
