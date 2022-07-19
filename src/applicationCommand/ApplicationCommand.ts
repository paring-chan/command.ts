import { ApplicationCommandType, ChatInputApplicationCommandData, MessageApplicationCommandData, UserApplicationCommandData } from 'discord.js'
import { BaseComponent, createComponentDecorator } from '../core'

export class ApplicationCommandComponent extends BaseComponent<
  (UserApplicationCommandData | MessageApplicationCommandData | Omit<ChatInputApplicationCommandData, 'options'>) & { type: ApplicationCommandType }
> {}

export const applicationCommand = createComponentDecorator(ApplicationCommandComponent)
