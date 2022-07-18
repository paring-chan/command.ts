import { BaseComponent, createComponentDecorator } from '../core'
import { ApplicationCommandDataResolvable } from 'discord.js'

export type ApplicationCommandOptions = {
  name: string
  description: string
}

export class SlashCommand extends BaseComponent<ApplicationCommandOptions> {
  defaultOptions() {
    return {
      name: '',
      description: '',
    }
  }
}

export const applicationCommand = createComponentDecorator(SlashCommand)
