/*
 * File: index.ts
 *
 * Copyright (c) 2022-2022 pikokr
 *
 * Licensed under MIT License. Please see more defails in LICENSE file.
 */

import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Client,
  Message
} from 'discord.js'
import { applicationCommand, CommandClient, moduleHook, option, ownerOnly, listener, Extension, command, rest, SubCommandGroup, interaction } from '../src'
import 'dotenv/config'
import { Logger } from 'tslog'
import chalk from 'chalk'

const group = new SubCommandGroup({
  name: 'hi',
  description: 'sans',
})

const sub = group.createChild({ name: 'sub', description: 'wow this is subcommand group' })

class Test extends Extension {
  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: 'test',
    description: 'wow this is test',
  })
  async testCommand(i: ChatInputCommandInteraction) {
    i.reply('Wow')
  }

  @ownerOnly
  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: 'test2',
    description: 'wow this is test wow',
  })
  async test2(
    @option({
      name: 'sans',
      description: '와',
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    wa: string,
    i: ChatInputCommandInteraction,
  ) {
    i.reply(wa)
  }

  @moduleHook('load')
  load() {
    this.logger.info('Load')
  }

  @group.command({ name: 'hi', description: 'Wow this is sans' })
  hi(i: ChatInputCommandInteraction) {
    i.reply('Hi this is subcommand')
  }

  @sub.command({ name: 'hi', description: 'Wow this is sans' })
  subHi(i: ChatInputCommandInteraction) {
    i.reply('Hi this is subcommand in subcommand group')
  }

  @moduleHook('unload')
  unload() {
    this.logger.info('Unload')
  }

  @listener({ event: 'ready' })
  async testEvent() {
    this.logger.info(`Login: ${chalk.green(client.user!.tag)}`)
    await this.commandClient.fetchOwners()
  }

  @command({ name: 'test' })
  async test(msg: Message, @rest() sans: string) {
    console.log(sans)
    await msg.reply('Wow')
  }

  @interaction({
    receiveType: 'Button',
    customId: 'id'
  })
  async testButton(interaction: ButtonInteraction) {
    console.log(JSON.stringify(interaction))
    await interaction.reply('sans!')
  }
}

const ext = new Test()

const client = new Client({ intents: ['GuildMessages', 'MessageContent', 'DirectMessages', 'Guilds'] })

const logger = new Logger({ dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone })

const cc = new CommandClient(client, logger)

const registry = cc.registry

const run = async () => {
  await cc.enableApplicationCommandsExtension({
    guilds: ['832938554438844438'],
  })

  await cc.enableTextCommandsExtension({
    prefix: '.',
  })

  await registry.registerModule(ext)

  await client.login(process.env.TOKEN)

  await client.application?.commands.set([])

  await cc.getApplicationCommandsExtension()!.sync()
}

run()
