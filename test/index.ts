import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, Client } from 'discord.js'
import { applicationCommand, CommandClient, moduleHook, option, Registry } from '../src'
import { listener } from '../src/core/listener'
import 'dotenv/config'
import { Logger } from 'tslog'
import chalk from 'chalk'
import { Extension } from '../src/core/extensions'

class Test extends Extension {
  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: 'test',
    description: 'wow this is test',
  })
  async testCommand(i: ChatInputCommandInteraction) {
    i.reply('Wow')
  }

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
  testEvent() {
    this.logger.info(`Login: ${chalk.green(client.user!.tag)}`)
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
