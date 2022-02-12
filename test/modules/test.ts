/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { applicationCommand, CommandClient, coolDown, CoolDownError, CoolDownType, listener, messageButton, messageSelectMenu, Module, option } from '../../src'
import {
  ActionRow,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonComponent,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  ContextMenuCommandInteraction,
  Message,
  MessageContextMenuCommandInteraction,
  SelectMenuComponent,
  SelectMenuInteraction,
  SelectMenuOption,
  UserContextMenuCommandInteraction,
} from 'discord.js'

class Test extends Module {
  constructor(private client: CommandClient) {
    super()
  }

  // region lifetime method
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
  // endregion

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
  @listener('applicationCommandError')
  slashCommandError(err: Error, i: CommandInteraction | ContextMenuCommandInteraction) {
    if (err instanceof CoolDownError) {
      return i.reply({
        content: `쿨다운: <t:${(err.endsAt.getTime() / 1000).toFixed(0)}:R>`,
        ephemeral: true,
      })
    }
    console.error(err)
  }

  @applicationCommand({
    command: {
      type: ApplicationCommandType.ChatInput,
      name: 'test',
      description: 'test',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'asdf',
          description: 'test',
        },
      ],
    },
  })
  @coolDown(CoolDownType.USER, 10)
  coolDownSlash(i: CommandInteraction, @option('asdf') asdf: string = 'wa sans') {
    i.reply({
      content: asdf,
      components: [
        new ActionRow().addComponents(new ButtonComponent().setLabel('test').setCustomId('testButton').setStyle(ButtonStyle.Primary)),
        new ActionRow().addComponents(
          new SelectMenuComponent()
            .setCustomId('testSelectMenu')
            .setPlaceholder('test')
            .setMinValues(1)
            .setOptions(
              new Array(10).fill(1).map(
                (_, i) =>
                  new SelectMenuOption({
                    label: `${i}`,
                    value: `${i}`,
                  }),
              ),
            ),
        ),
      ],
    })
  }

  @applicationCommand({
    command: {
      type: ApplicationCommandType.Message,
      name: 'contextMenuTest',
      defaultPermission: true,
    },
  })
  @coolDown(CoolDownType.USER, 10)
  async contextMenuMessage(i: MessageContextMenuCommandInteraction) {
    return i.reply({
      content: `message id: ${i.targetId}`,
    })
  }

  @applicationCommand({
    command: {
      type: ApplicationCommandType.User,
      name: 'contextMenuTest',
      defaultPermission: true,
    },
  })
  @coolDown(CoolDownType.USER, 10)
  async contextMenuUser(i: UserContextMenuCommandInteraction) {
    return i.reply({
      content: `user id: ${i.targetId}`,
    })
  }

  @messageButton('testButton')
  async testButton(i: ButtonInteraction) {
    await i.update({
      content: 'test',
      components: [],
    })
  }

  @messageSelectMenu('testSelectMenu')
  async testSelectMenu(i: SelectMenuInteraction) {
    await i.update({
      content: i.values.join(', '),
      components: [],
    })
  }
}

export function install(client: CommandClient) {
  return new Test(client)
}
