import type { ApplicationCommandType, ChatInputApplicationCommandData, MessageApplicationCommandData, Snowflake, UserApplicationCommandData } from 'discord.js'
import { createComponentDecorator } from '../core/components/decoratorCreator'
import { BaseComponent } from '../core/components/BaseComponent'
import type { SubCommandGroup, SubCommandGroupChild } from './group'

type Options = (UserApplicationCommandData | MessageApplicationCommandData | Omit<ChatInputApplicationCommandData, 'options'>) & {
  type: ApplicationCommandType
  guilds?: Snowflake[]
}

export class ApplicationCommandComponent extends BaseComponent {
  options: Options

  subcommandGroup?: SubCommandGroup
  subcommandGroupChild?: SubCommandGroupChild

  constructor(options: UserApplicationCommandData | MessageApplicationCommandData | Omit<ChatInputApplicationCommandData, 'options'>) {
    super()

    this.options = options as Options
  }
}

export const applicationCommand = (options: Options) => createComponentDecorator(new ApplicationCommandComponent(options))

export type { Options as ApplicationCommandComponentOptions }
