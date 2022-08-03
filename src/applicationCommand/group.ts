import { APIApplicationCommandSubcommandOption, ApplicationCommandType, ChatInputApplicationCommandData } from 'discord.js'
import { createComponentDecorator } from '../core'
import { ApplicationCommandComponent } from './ApplicationCommand'

export class SubCommandGroup {
  constructor(public options: Omit<APIApplicationCommandSubcommandOption, 'type'>, public guilds?: string[]) {}

  command(options: Omit<ChatInputApplicationCommandData, 'options' | 'type'>): MethodDecorator {
    const cmd = new ApplicationCommandComponent({
      type: ApplicationCommandType.ChatInput,
      ...options,
    })
    cmd.subcommandGroup = this
    return createComponentDecorator(cmd)
  }

  createChild(options: Omit<APIApplicationCommandSubcommandOption, 'type'>) {
    return new SubCommandGroupChild(options, this)
  }
}

export class SubCommandGroupChild {
  constructor(public options: Omit<APIApplicationCommandSubcommandOption, 'type'>, public parent: SubCommandGroup) {}

  command(options: Omit<ChatInputApplicationCommandData, 'options' | 'type'>): MethodDecorator {
    const cmd = new ApplicationCommandComponent({
      type: ApplicationCommandType.ChatInput,
      ...options,
    })
    cmd.subcommandGroupChild = this
    return createComponentDecorator(cmd)
  }
}
