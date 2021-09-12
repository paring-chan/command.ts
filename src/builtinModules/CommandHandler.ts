import { BuiltInModule } from './BuiltInModule'
import { Registry } from '../structures'
import { listener } from '../listener'
import { Message } from 'discord.js'
import { CommandClient } from '../structures'
import { Command } from '../command'

export class CommandHandler extends BuiltInModule {
  private client: CommandClient

  constructor(private registry: Registry) {
    super()
    this.client = registry.client
  }

  @listener('messageCreate')
  async message(msg: Message) {
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

    console.log(command)

    for (const c of this.registry.commands) {
      if (c.name === command) {
        cmd = c
        break
      }
      if (
        (typeof c.aliases === 'function'
          ? await c.aliases(msg)
          : c.aliases
        ).includes(command)
      ) {
        cmd = c
        break
      }
    }

    if (!cmd) return

    console.log(command, cmd, args)
  }
}
