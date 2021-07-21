import { Message } from 'discord.js'
import commands, { Default } from './commands'

export class DebugModule {
  static async run(msg: Message) {
    const args = msg.content.split(' ')
    args.shift()
    const commandName = args.shift()
    const command = commands.find((x) => x.name === commandName)
    if (!commandName || !command) {
      await Default.execute(msg)
      return
    }
    return command.execute(msg, args)
  }
}
