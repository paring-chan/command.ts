import { Message } from 'discord.js'
import * as commands from './commands'

export class DebugModule {
  static async run(msg: Message) {
    const args = msg.content.split(' ')
    args.shift()
    const commandName = args.shift()
    if (!commandName) {
      await commands.Default.execute(msg)
      return
    }
    await msg.reply(commandName)
  }
}
