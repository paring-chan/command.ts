/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { applicationCommand, ApplicationCommandCheckFailed, BuiltInModule, CommandClient, listener, ownerOnly } from '../../src'
import { ApplicationCommandType, CommandInteraction } from 'discord.js'

export class Dev extends BuiltInModule {
  constructor(private cts: CommandClient) {
    super()
  }

  @listener('slashCommandError')
  slashError(e: Error, i: CommandInteraction) {
    if (e instanceof ApplicationCommandCheckFailed) {
      return i.reply({
        content: 'Command before-run check failed',
        ephemeral: true,
      })
    }
    console.error(e.message)
  }

  // new SlashCommandBuilder().setName('reload').setDescription('리로드 커맨드')
  @applicationCommand({
    command: {
      name: 'reload',
      type: ApplicationCommandType.ChatInput,
      description: '리로드 커맨드',
    },
    guild: ['457841749197586438'],
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
