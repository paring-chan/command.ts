import commands, { Default } from './commands'
import { Context } from '../..'

export class DebugModule {
  static async run(ctx: Context) {
    const args = ctx.msg.content.slice(ctx.prefix.length).split(' ')
    args.shift()
    const commandName = args.shift()
    const command = commands.find((x) => x.name === commandName)
    if (!commandName || !command) {
      await Default.execute(ctx.msg)
      return
    }
    return command.execute(ctx.msg, args)
  }
}
