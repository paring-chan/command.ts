import { ApplicationCommandType } from 'discord.js'
import { BaseComponent, createComponentDecorator } from '../core'

type ApplicationCommandOptions = {
  type: ApplicationCommandType
}

type ApplicationCommandRequiredOptions = {
  name: string
  description: string
}

export class ApplicationCommandComponent extends BaseComponent<ApplicationCommandOptions, ApplicationCommandRequiredOptions> {
  defaultOptions() {
    return {
      type: ApplicationCommandType.ChatInput,
    }
  }
}

export const applicationCommand = createComponentDecorator(ApplicationCommandComponent)
