import commands, { Default } from './commands'
import { Context } from '../index'

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
    try {
      await command.execute(ctx.msg, args)
    } catch {
      await ctx.msg.reply('Command failed.')
    }
  }
}
