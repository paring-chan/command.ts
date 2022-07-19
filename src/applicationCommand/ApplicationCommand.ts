import { ApplicationCommandType } from 'discord.js'
import { BaseComponent, createComponentDecorator } from '../core'

export type ApplicationCommandOptions = {
  name: string
  description: string
  type: ApplicationCommandType
}

export class ApplicationCommandComponent extends BaseComponent<ApplicationCommandOptions> {
  defaultOptions() {
    return {
      name: '',
      description: '',
      type: ApplicationCommandType.ChatInput,
    }
  }
}

export const applicationCommand = createComponentDecorator(ApplicationCommandComponent)
