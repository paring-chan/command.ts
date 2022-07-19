import { ApplicationCommandData, ApplicationCommandType, Interaction, Snowflake } from 'discord.js'
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

    this.logger.info(commands)
  }
}
