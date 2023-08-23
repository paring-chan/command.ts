import type { ApplicationCommandSubGroupData, ChatInputApplicationCommandData } from 'discord.js'
import { ApplicationCommandType } from 'discord.js'
import { createComponentDecorator } from '../core'
import { ApplicationCommandComponent } from './ApplicationCommand'

export class SubCommandGroup {
  constructor(
    public options: Omit<ChatInputApplicationCommandData, 'type'>,
    public guilds?: string[],
  ) {}

  command(options: Omit<ApplicationCommandSubGroupData, 'options' | 'type'>): MethodDecorator {
    const cmd = new ApplicationCommandComponent({
      type: ApplicationCommandType.ChatInput,
      ...options,
    })
    cmd.subcommandGroup = this
    return createComponentDecorator(cmd)
  }

  createChild(options: Omit<ApplicationCommandSubGroupData, 'options' | 'type'>) {
    return new SubCommandGroupChild(options, this)
  }
}

export class SubCommandGroupChild {
  constructor(
    public options: Omit<ApplicationCommandSubGroupData, 'options' | 'type'>,
    public parent: SubCommandGroup,
  ) {}

  command(options: Omit<ChatInputApplicationCommandData, 'options' | 'type'>): MethodDecorator {
    const cmd = new ApplicationCommandComponent({
      type: ApplicationCommandType.ChatInput,
      ...options,
    })
    cmd.subcommandGroupChild = this
    return createComponentDecorator(cmd)
  }
}
