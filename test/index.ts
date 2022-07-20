/*
 * File: index.ts
 *
 * Copyright (c) 2022-2022 pikokr
 *
 * Licensed under MIT License. Please see more defails in LICENSE file.
 */

import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, Client } from 'discord.js'
import { applicationCommand, CommandClient, moduleHook, option, ownerOnly, listener, Extension } from '../dist'
import 'dotenv/config'
import { Logger } from 'tslog'
import chalk from 'chalk'

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

  @moduleHook('unload')
  unload() {
    this.logger.info('Unload')
  }

  @listener({ event: 'ready' })
  async testEvent() {
    this.logger.info(`Login: ${chalk.green(client.user!.tag)}`)
    await this.commandClient.fetchOwners()
  }
}

const ext = new Test()

const client = new Client({ intents: [] })

const logger = new Logger({ dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone })

const cc = new CommandClient(client, logger)

const registry = cc.registry

const run = async () => {
  await cc.enableApplicationCommandsExtension({
    guilds: ['832938554438844438'],
  })

  await registry.registerModule(ext)

  await client.login(process.env.TOKEN)

  await cc.getApplicationCommandsExtension()!.sync()
}

run()
