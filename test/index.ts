import { ApplicationCommandOptionType, ApplicationCommandType, Client } from 'discord.js'
import { applicationCommand, CommandClient, moduleHook, option, Registry } from '../src'
import { listener } from '../src/core/listener'
import 'dotenv/config'
import { Logger } from 'tslog'
import chalk from 'chalk'

class Test {
  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: 'test',
    description: 'wow this is test',
  })
  async testCommand() {}

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
    })
    wa: string,
  ) {}

  @moduleHook('load')
  load() {
    console.log('load')
  }

  @moduleHook('unload')
  unload() {
    console.log('unload')
  }

  @listener({ event: 'test', emitter: 'discord' })
  testEvent() {
    console.log('test')
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

  logger.info(`Login: ${chalk.green(client.user!.tag)}`)

  await cc.getApplicationCommandsExtension()!.sync()
}

run()
