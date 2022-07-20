import chalk from 'chalk'
import {
  ApplicationCommandData,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  GuildAuditLogs,
  Interaction,
  InteractionType,
  MessageContextMenuCommandInteraction,
  Snowflake,
  UserContextMenuCommandInteraction,
} from 'discord.js'
import { ApplicationCommandComponent } from '.'
import { ApplicationCommandOption } from './ApplicationCommandOption'
import { moduleHook } from '../core/hooks'
import { listener } from '../core/listener'
import { CommandClient } from '../core/structures'
import { argConverter } from '../core/converter'
import { CTSExtension } from '../core/extensions/CTSExtension'

export type ApplicationCommandExtensionConfig = {
  guilds?: Snowflake[]
}

export class ApplicationCommandExtension extends CTSExtension {
  constructor(public config: ApplicationCommandExtensionConfig) {
    super()
  }

  @listener({ event: 'interactionCreate' })
  async interactionCreate(i: Interaction) {
    if (i.type !== InteractionType.ApplicationCommand) return

    let cmd: ApplicationCommandComponent | null = null
    let ext: object | null = null

    const extensions = this.commandClient.registry.extensions

    for (const extension of extensions) {
      const components = this.commandClient.registry.getComponentsWithType(extension, ApplicationCommandComponent)

      for (const command of components) {
        if (command.options.name === i.commandName) {
          ext = extension
          cmd = command
        }
      }
    }

    if (cmd && ext) {
      const argList: unknown[] = []

      await this.convertArguments(ApplicationCommandComponent, argList, cmd.argTypes, () => [i])

      for (const [idx, arg] of cmd.argTypes) {
        let value: unknown = null

        for (const decorator of arg.decorators) {
          if (decorator instanceof ApplicationCommandOption) {
            value = i.options.get(decorator.options.name, false)?.value
            break
          }
        }

        if (value) {
          argList[idx] = value
        }
      }

      try {
        await cmd.execute(ext, argList)
      } catch (e) {
        this.logger.error(e)
        this.commandClient.emit('applicationCommandInvokeError', e, i)
      }
    }
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

  @argConverter({
    component: ApplicationCommandComponent,
    parameterless: true,
    type: ChatInputCommandInteraction,
  })
  async chatInteraction(i: ChatInputCommandInteraction) {
    return i
  }

  @argConverter({
    component: ApplicationCommandComponent,
    parameterless: true,
    type: MessageContextMenuCommandInteraction,
  })
  async messageInteraction(i: MessageContextMenuCommandInteraction) {
    return i
  }

  @argConverter({
    component: ApplicationCommandComponent,
    parameterless: true,
    type: UserContextMenuCommandInteraction,
  })
  async userInteraction(i: UserContextMenuCommandInteraction) {
    return i
  }
}
