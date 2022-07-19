import chalk from 'chalk'
import { ApplicationCommandData, ApplicationCommandType, GuildAuditLogs, Interaction, Snowflake } from 'discord.js'
import { ApplicationCommandComponent } from '../../applicationCommand'
import { ApplicationCommandOption } from '../../applicationCommand/ApplicationCommandOption'
import { moduleHook } from '../hooks'
import { listener } from '../listener'
import { CommandClient } from '../structures'
import { Extension } from './Extension'

export type ApplicationCommandExtensionConfig = {
  guilds?: Snowflake[]
}

export class ApplicationCommandExtension extends Extension {
  constructor(public config: ApplicationCommandExtensionConfig) {
    super()
  }

  @listener({ event: 'interactionCreate' })
  async interactionCreate(i: Interaction) {
    console.log(i)
  }

  @moduleHook('load')
  async load() {}

  async sync() {
    const client = CommandClient.getFromModule(this)

    this.logger.info('Trying to sync commands...')

    const commands: ApplicationCommandData[] = []

    for (const command of client.registry.getComponentsWithTypeGlobal(ApplicationCommandComponent)) {
      const cmd: ApplicationCommandData = { ...command.options }

      if (cmd.type === ApplicationCommandType.ChatInput) {
        cmd.options = []

        for (const [, arg] of command.argTypes) {
          const option = arg.decorators.find((x) => x.constructor === ApplicationCommandOption) as ApplicationCommandOption

          if (option) {
            cmd.options.push(option.options)
          }
        }
      }

      commands.push(cmd)
    }

    this.logger.info(`Processing ${chalk.green(commands.length)} commands(${commands.map((x) => chalk.blue(x.name)).join(', ')})`)

    if (this.config.guilds) {
      for (const guild of this.config.guilds) {
        try {
          const g = await this.client.guilds.fetch(guild)
          await g.fetch()
          this.logger.info(`Registering commands for guild ${chalk.green(g.name)}(${chalk.blue(g.id)})`)

          await g.commands.set(commands)

          this.logger.info(`Successfully registered commands for guild ${chalk.green(g.name)}(${chalk.blue(g.id)})`)
        } catch (e) {
          this.logger.error(`Failed to register commands to guild ${chalk.green(guild)}: ${(e as Error).message}`)
        }
      }
    } else {
      try {
        this.logger.info(`Registering commands globally...`)

        await this.client.application!.commands.set(commands)

        this.logger.info('Successfully registered commands.')
      } catch (e) {
        this.logger.error(`Failed to register commands to global: ${(e as Error).message}`)
      }
    }
  }
}
