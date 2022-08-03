/*
 * File: ApplicationCommand.ts
 *
 * Copyright (c) 2022-2022 pikokr
 *
 * Licensed under MIT License. Please see more defails in LICENSE file.
 */

import type { ApplicationCommandType, ChatInputApplicationCommandData, MessageApplicationCommandData, Snowflake, UserApplicationCommandData } from 'discord.js'
import { createComponentDecorator } from '../core/components/decoratorCreator'
import { BaseComponent } from '../core/components/BaseComponent'

type Options = (UserApplicationCommandData | MessageApplicationCommandData | Omit<ChatInputApplicationCommandData, 'options'>) & {
  type: ApplicationCommandType
  guilds?: Snowflake[]
}

export class ApplicationCommandComponent extends BaseComponent {
  options: Options

  constructor(options: UserApplicationCommandData | MessageApplicationCommandData | Omit<ChatInputApplicationCommandData, 'options'>) {
    super()

    this.options = options as Options
  }
}

export const applicationCommand = (options: Options) => createComponentDecorator(new ApplicationCommandComponent(options))
