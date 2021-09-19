import { BuiltInModule, CommandClient, ownerOnly, slashCommand } from '../../src'
import { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

export class Dev extends BuiltInModule {
  constructor(private cts: CommandClient) {
    super()
  }

  @slashCommand({
    command: new SlashCommandBuilder().setName('reload').setDescription('리로드 커맨드'),
  })
  @ownerOnly
  async reload(i: CommandInteraction) {
    const data = await this.cts.registry.reloadAll()
    await i.reply({
      ephemeral: true,
      content: '```\n' + data.map((x) => (x.success ? `✅ ${x.path}` : `❌ ${x.path}\n${x.error}`)).join('\n') + '```',
    })
  }
}

export function install(cts: CommandClient) {
  return new Dev(cts)
}
