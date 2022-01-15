import { BuiltInModule } from './BuiltInModule'
import { Registry } from '../structures'
import { listener } from '../listener'
import { CommandInteraction, GuildMember, Interaction, Message, Role, User } from 'discord.js'
import { CommandClient } from '../structures'
import { Command } from '../command'
import { ArgumentConverterNotFound, ArgumentNotProvided, CommandCheckFailed, SlashArgumentConverterNotFound, SlashCommandCheckFailed } from '../error'
import { CommandNotFound } from '../error/CommandNotFound'

export class CommandHandler extends BuiltInModule {
  private readonly client: CommandClient

  constructor(private registry: Registry) {
    super()
    this.client = registry.client
  }

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

      for (const c of this.registry.commands) {
        if (c.name === command) {
          cmd = c
          break
        }
        if ((typeof c.aliases === 'function' ? await c.aliases(msg) : c.aliases).includes(command)) {
          cmd = c
          break
        }
      }

      msg.data = {
        cts: this.client,
        command: cmd!,
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

  private async command(i: CommandInteraction) {
    const error = (error: Error) => this.client.client.emit('slashCommandError', error, i)
    try {
      const cmd = this.registry.slashCommands.find((x) => x.commandBuilder.name === i.commandName)

      const module = this.registry.modules.find((x) => x.slashCommands.includes(cmd!))

      if (!module) return

      const argList: any[] = []

      if (!cmd)
        return i.reply({
          content: 'Unknown command.',
          ephemeral: true,
        })

      i.data = {
        cts: this.client,
        command: cmd,
      }

      for (const check of cmd.checks) {
        if (!(await check(i))) return error(new SlashCommandCheckFailed(i, cmd))
      }

      for (let j = 0; j < cmd.params.length; j++) {
        const argType = cmd.params[j]
        const converter = this.registry.slashArgumentConverters.find((x) => x.type === argType.type)

        if (argType.name) {
          switch (argType.type) {
            case String:
              argList.push(i.options.getString(argType.name, false) || undefined)
              break
            case Role:
              argList.push(i.options.getRole(argType.name, false) || undefined)
              break
            case User:
              argList.push(i.options.getUser(argType.name, false) || undefined)
              break
            case GuildMember:
              argList.push(i.options.getMember(argType.name, false) || undefined)
              break
            case Boolean:
              argList.push(i.options.getBoolean(argType.name, false) || undefined)
              break
            case Number:
              const opt = i.options.get(argType.name, false)
              if (!opt) {
                argList.push(undefined)
                break
              }
              if (opt.type == 'NUMBER') {
                argList.push(i.options.getNumber(argType.name, false) ?? undefined)
                break
              }
              if (opt.type == 'INTEGER') {
                argList.push(i.options.getInteger(argType.name, false) ?? undefined)
                break
              }
          }
          continue
        }

        if (!converter) return error(new SlashArgumentConverterNotFound(argType, i))

        argList.push(await converter.execute(module, i))
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

  @listener('interactionCreate')
  async interaction(i: Interaction) {
    if (i.isCommand()) {
      await this.command(i)
    }
  }
}
