import { command, CommandClient, coolDown, CoolDownError, CoolDownType, listener, messageButton, messageSelectMenu, Module, option, rest, applicationCommand } from '../../src'
import {
  ButtonInteraction,
  CommandInteraction,
  ContextMenuInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageContextMenuInteraction,
  MessageSelectMenu,
  SelectMenuInteraction,
  UserContextMenuInteraction,
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
  slashCommandError(err: Error, msg: CommandInteraction | ContextMenuInteraction) {
    if (err instanceof CoolDownError) {
      return msg.reply({
        content: `쿨다운: <t:${(err.endsAt.getTime() / 1000).toFixed(0)}:R>`,
        ephemeral: true,
      })
    }
    console.error(err)
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: 'test',
      description: 'test',
      options: [
        {
          type: 'STRING',
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
        new MessageActionRow().addComponents(new MessageButton().setLabel('test').setCustomId('testButton').setStyle('PRIMARY')),
        new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId('testSelectMenu')
            .setPlaceholder('test')
            .setMinValues(1)
            .setOptions(
              new Array(10).fill(1).map((_, i) => ({
                label: `${i}`,
                value: `${i}`,
              })),
            ),
        ),
      ],
    })
  }

  @applicationCommand({
    command: {
      type: 'MESSAGE',
      name: 'contextMenuTest',
      defaultPermission: true,
    },
  })
  @coolDown(CoolDownType.USER, 10)
  async contextMenuMessage(i: MessageContextMenuInteraction) {
    return i.reply({
      content: `message id: ${i.targetMessage.id}`,
    })
  }

  @applicationCommand({
    command: {
      type: 'USER',
      name: 'contextMenuTest',
      defaultPermission: true,
    },
  })
  @coolDown(CoolDownType.USER, 10)
  async contextMenuUser(i: UserContextMenuInteraction) {
    return i.reply({
      content: `user id: ${i.targetUser.id}`,
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
