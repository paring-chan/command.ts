import { Interaction, Message } from 'discord.js'
import { CommandClient, Context, Module } from '../structures'
import { listener } from '../listener'

export class CommandHandler extends Module {
  constructor(private client: CommandClient) {
    super(__filename)
  }

  @listener('messageCreate')
  async onMessage(msg: Message) {
    if (!this.client.commandOptions.commands.allowSelf && msg.author.id === this.client.user!.id) return
    if (!this.client.commandOptions.commands.allowBots && msg.author.bot) return
    const prefixFunction = this.client.commandOptions.prefix
    const prefix =
      typeof prefixFunction === 'function'
        ? await prefixFunction(msg)
        : prefixFunction
    const { content } = msg
    if (!content.startsWith(prefix)) return
    const args = content.slice(prefix.length).split(' ')
    const command = args.shift()
    if (!command) return
    const cmd = this.client.registry.commandManager.commandList.find(
      (x) =>
        x.name.toLowerCase() === command.toLowerCase() ||
        x.aliases.map((r) => r.toLowerCase()).includes(command),
    )
    if (!cmd) return
    if (cmd.ownerOnly) {
      if (!this.client.owners.includes(msg.author.id))
        return this.client.emit('ownerOnlyCommand', msg, cmd)
    }
    const checks = cmd.checks
    for (const check of checks) {
      try {
        if (!(await check(msg))) return
      } catch {
        return
      }
    }
    const commandArgs = cmd.args
    const parsedArgs: any[] = []
    for (const i in commandArgs) {
      const v = args.shift()!
      const arg = commandArgs[i]
      if (arg.rest) {
        parsedArgs.push([v, ...args].join(' '))
        break
      }
      if (!arg.optional && !v) {
        return this.client.emit(
          'commandError',
          new Error(`An argument is required but not provided.`),
        )
      }
      if (arg.optional && !v) {
        break
      }
      if (arg.type === String) {
        parsedArgs[i] = v
        continue
      }
      const converter = this.client.registry.commandManager.argConverterList.find(
        (x) => x.type === arg.type,
      )
      if (converter) {
        try {
          parsedArgs[i] = await converter.convert.apply(converter.module, [
            v,
            msg,
          ])
          if (!parsedArgs[i]) {
            return this.client.emit(
              'commandError',
              new Error('Argument converter returned no result.'),
              msg,
            )
          }
        } catch (e) {
          return this.client.emit('commandError', e, msg)
        }
      } else {
        return this.client.emit(
          'commandError',
          new Error(
            `No converter found for type ${arg.type.constructor.name}.`,
          ),
        )
      }
    }
    const executeArgs = []
    if (cmd.usesCtx) {
      executeArgs[0] = new Context(msg, prefix)
    } else {
      executeArgs[0] = msg
    }
    executeArgs.push(...parsedArgs)
    try {
      cmd.execute.apply(cmd.module, executeArgs)
    } catch (e) {
      this.client.emit('commandError', e, msg)
    }
  }

  @listener('interactionCreate')
  async interaction(i: Interaction) {
    if (
      this.client.commandOptions.slashCommands.guild &&
      this.client.commandOptions.slashCommands.guild !== i.guildId
    )
      return
    if (!i.isCommand()) return
    const cmd = i.command!
    const command = this.client.registry.slashCommandManager.commandList.find(
      (x) => x.name === cmd.name,
    )
    if (!command) return
    command.execute(i, i.options)
  }
}
