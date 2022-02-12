/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { BuiltInModule } from './BuiltInModule'
import { CommandClient, Registry } from '../structures'
import { listener } from '../listener'
import {
  ApplicationCommandType,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  Interaction,
  Message,
  MessageComponentInteraction,
  MessageContextMenuCommandInteraction,
  Role,
  User,
  UserContextMenuCommandInteraction,
} from 'discord.js'
import { Command } from '../command'
import { ApplicationCommandArgumentConverterNotFound, ApplicationCommandCheckFailed, ArgumentConverterNotFound, ArgumentNotProvided, CommandCheckFailed } from '../error'
import { CommandNotFound } from '../error/CommandNotFound'
import { SlashCommandGlobalCheckError } from '../error/checks/SlashCommandGlobalCheckError'
import { MessageComponentHandler } from '../messageComponents/base'

export class CommandHandler extends BuiltInModule {
  private readonly client: CommandClient

  constructor(private registry: Registry) {
    super()
    this.client = registry.client
  }

  // region message command handler
  @listener('messageCreate')
  async message(msg: Message) {
    const error = (error: Error) => this.client.client.emit('commandError', error, msg)

    try {
      const prefixList: string[] | string =
        typeof this.client.options.command.prefix === 'string'
          ? this.client.options.command.prefix
          : typeof this.client.options.command.prefix === 'function'
          ? await this.client.options.command.prefix(msg)
          : this.client.options.command.prefix
      let prefix: string
      if (typeof prefixList === 'object') {
        const res = prefixList.find((x) => msg.content.includes(x))

        if (!res) return

        prefix = res
      } else {
        if (!msg.content.includes(prefixList)) return
        prefix = prefixList
      }

      if (!msg.content.startsWith(prefix)) return

      const args = msg.content.slice(prefix.length).split(' ')

      const command = args.shift()

      if (!command) return

      let cmd: Command | null = null

      const globalAliases = await this.client.options.command.globalAliases(command, msg)

      for (const c of this.registry.commands) {
        const globalAliases2 = await this.client.options.command.globalAliases(c.name, msg)
        const aliases = typeof c.aliases === 'function' ? await c.aliases(msg) : c.aliases
        if ([...aliases, c.name].some((x) => x === command)) {
          cmd = c
          break
        }
        if (globalAliases.every((x, i) => globalAliases2[i] === x)) {
          cmd = c
          break
        }
      }

      msg.data = {
        cts: this.client,
        command: cmd,
        prefix: prefix,
      }

      if (!(await this.client.options.command.check(msg))) {
        return
      }

      if (!cmd) return error(new CommandNotFound(command, msg, args))

      const module = this.registry.modules.find((x) => x.commands.includes(cmd!))

      if (!module) return

      const argList: any[] = []

      for (const check of cmd.checks) {
        if (!(await check(msg))) return error(new CommandCheckFailed(msg, cmd))
      }

      for (let i = 0; i < cmd.argTypes.length; i++) {
        const argType = cmd.argTypes[i]
        const converter = this.registry.argumentConverters.find((x) => x.type === argType.type)

        if (argType.rest) {
          const i = args.join(' ')
          if (!i) break
          argList.push(i)
          break
        }

        if (!converter) return error(new ArgumentConverterNotFound(argType, msg))

        const converterModule = this.registry.modules.find((x) => x.argumentConverters.includes(converter))

        if (!converterModule) return error(new ArgumentConverterNotFound(argType, msg))

        if (converter.withoutParameter) {
          argList.push(await converter.execute(converterModule, msg))
          continue
        }
        const arg = args.shift()
        if (argType.optional && !arg) {
          break
        }
        if (!arg) {
          return error(new ArgumentNotProvided(i, cmd, msg))
        }
        const executed = await converter.execute(converterModule, msg, arg)
        if ((executed === undefined || executed === null) && !argType.optional) {
          return error(new ArgumentNotProvided(i, cmd, msg))
        }
        argList.push(executed)
      }

      try {
        await cmd.execute(module, argList)
      } catch (e: any) {
        return error(e)
      }
    } catch (e) {
      return error(e)
    }
  }
  // endregion

  // region slash command handler
  private async command(i: CommandInteraction) {
    const error = (error: Error) => this.client.client.emit('applicationCommandError', error, i)
    try {
      const cmd = this.registry.applicationCommands.find((x) => x.command.type === ApplicationCommandType.ChatInput && x.command.name === i.commandName)

      if (!cmd) return

      const module = this.registry.modules.find((x) => x.applicationCommands.includes(cmd))

      if (!module) return

      const argList: any[] = []

      i.data = {
        cts: this.client,
        command: cmd,
      }

      if (!(await this.client.options.slashCommands.check(i))) {
        return error(new SlashCommandGlobalCheckError(i))
      }
      for (const check of cmd.checks) {
        if (!(await check(i))) return error(new ApplicationCommandCheckFailed(i, cmd))
      }

      for (let j = 0; j < cmd.params.length; j++) {
        const argType = cmd.params[j]
        const converter = this.registry.applicationCommandArgumentConverters.find((x) => x.type === argType.type)

        if (argType.type === CommandInteraction) {
          argList.push(i)
          continue
        }

        if (argType.type === CommandInteractionOptionResolver) {
          argList.push(i.options)
          continue
        }

        if (argType.name) {
          switch (argType.type) {
            case String:
            case Role:
            case Boolean:
            case Number:
              argList.push(i.options.get(argType.name, false)?.value || undefined)
              break
            case User:
              argList.push(i.options.getUser(argType.name, false) || undefined)
              break
            case GuildMember:
              argList.push(i.options.getMember(argType.name) || undefined)
              break
          }
          continue
        }

        if (!converter) return error(new ApplicationCommandArgumentConverterNotFound(argType, i))

        argList.push(await converter.execute(module, i))
      }

      await cmd.execute(module, argList)
    } catch (e) {
      return error(e)
    }
  }
  // endregion

  private async messageComponent(i: MessageComponentInteraction) {
    const error = (e: any) => this.client.client.emit('messageComponentError', e)

    try {
      const handlers: MessageComponentHandler[] = []

      for (const handler of this.registry.messageComponentHandlers) {
        if (handler.componentId === handler.componentId && handler.componentType === i.componentType) {
          handlers.push(handler)
        }
      }

      for (const handler of handlers) {
        const module = this.registry.modules.find((x) => x.messageComponentHandlers.includes(handler))
        if (!module) continue
        await handler.run(module, i)
      }
    } catch (e) {
      error(e)
    }
  }

  private async userContextMenu(i: UserContextMenuCommandInteraction) {
    const error = (error: Error) => this.client.client.emit('applicationCommandError', error, i)
    try {
      const cmd = this.registry.applicationCommands.find((x) => x.command.type === ApplicationCommandType.User && x.command.name === i.commandName)

      if (!cmd) return

      const module = this.registry.modules.find((x) => x.applicationCommands.includes(cmd))

      if (!module) return

      i.data = {
        cts: this.client,
        command: cmd,
      }

      for (const check of cmd.checks) {
        if (!(await check(i))) return error(new ApplicationCommandCheckFailed(i, cmd))
      }

      let argList: any[] = []

      for (let j = 0; j < cmd.params.length; j++) {
        const argType = cmd.params[j]
        const converter = this.registry.applicationCommandArgumentConverters.find((x) => x.type === argType.type)

        if (argType.type === UserContextMenuCommandInteraction) {
          argList.push(i)
          continue
        }

        if (!converter) return error(new ApplicationCommandArgumentConverterNotFound(argType, i))

        argList.push(await converter.execute(module, i))
      }

      await cmd.execute(module, argList)
    } catch (e) {
      return error(e)
    }
  }

  private async messageContextMenu(i: MessageContextMenuCommandInteraction) {
    const error = (error: Error) => this.client.client.emit('applicationCommandError', error, i)
    try {
      const cmd = this.registry.applicationCommands.find((x) => x.command.type === ApplicationCommandType.Message && x.command.name === i.commandName)

      if (!cmd) return

      const module = this.registry.modules.find((x) => x.applicationCommands.includes(cmd))

      if (!module) return

      i.data = {
        cts: this.client,
        command: cmd,
      }

      for (const check of cmd.checks) {
        if (!(await check(i))) return error(new ApplicationCommandCheckFailed(i, cmd))
      }

      let argList: any[] = []

      for (let j = 0; j < cmd.params.length; j++) {
        const argType = cmd.params[j]
        const converter = this.registry.applicationCommandArgumentConverters.find((x) => x.type === argType.type)

        if (argType.type === MessageContextMenuCommandInteraction) {
          argList.push(i)
          continue
        }

        if (!converter) return error(new ApplicationCommandArgumentConverterNotFound(argType, i))

        argList.push(await converter.execute(module, i))
      }

      await cmd.execute(module, argList)
    } catch (e) {
      return error(e)
    }
  }

  @listener('interactionCreate')
  async interaction(i: Interaction) {
    const error = (e: any) => this.client.client.emit('interactionError', e, i)

    try {
      await this.client.options.applicationCommands.beforeRunCheck(i)
      if (i.isChatInputCommand()) {
        await this.command(i)
        return
      }
      if (i.isMessageComponent()) {
        await this.messageComponent(i)
        return
      }
      if (i.isMessageContextMenuCommand()) {
        await this.messageContextMenu(i)
        return
      }
      if (i.isUserContextMenuCommand()) {
        await this.userContextMenu(i)
        return
      }
    } catch (e) {
      return error(e)
    }
  }
}
