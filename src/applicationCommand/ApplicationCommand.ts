/*
* File: ApplicationCommand.ts
* 
* Copyright (c) 2022-2022 pikokr
* 
* Licensed under MIT License. Please see more defails in LICENSE file.
*/

import type { ApplicationCommandType, ChatInputApplicationCommandData, MessageApplicationCommandData, UserApplicationCommandData } from 'discord.js'
import { createComponentDecorator } from '../core/components/decoratorCreator'
import { BaseComponent } from '../core/components/BaseComponent'

export class ApplicationCommandComponent extends BaseComponent<
  (UserApplicationCommandData | MessageApplicationCommandData | Omit<ChatInputApplicationCommandData, 'options'>) & { type: ApplicationCommandType }
> {}

export const applicationCommand = createComponentDecorator(ApplicationCommandComponent)
