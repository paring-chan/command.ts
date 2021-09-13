import { BuiltInModule } from './BuiltInModule'
import { Registry } from '../structures'
import { listener } from '../listener'
import { Message } from 'discord.js'
import { CommandClient } from '../structures'
import { Command } from '../command'
import { ArgumentConverterNotFound, ArgumentNotProvided, CommandCheckFailed } from '../error'
import { CommandNotFound } from '../error/CommandNotFound'

export class CommandHandler extends BuiltInModule {
  private client: CommandClient

  constructor(private registry: Registry) {
    super()
    this.client = registry.client
  }

  @listener('messageCreate')
  async message(msg: Message) {
    const error = (error: Error) => this.client.client.emit('commandError', error, msg)

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

    if (!cmd) return error(new CommandNotFound(command))

    msg.data = {
      cts: this.client,
      command: cmd,
      prefix: prefix,
    }

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

      if (converter.withoutParameter) {
        argList.push(await converter.execute(module, msg))
        continue
      }
      const arg = args.shift()
      if (argType.optional && !arg) {
        break
      }
      if (!arg) {
        return error(new ArgumentNotProvided(i, cmd, msg))
      }
      argList.push(await converter.execute(module, msg, arg))
    }

    try {
      cmd.execute(module, argList)
    } catch (e: any) {
      return error(e)
    }
  }
}
