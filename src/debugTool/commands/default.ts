import { Message } from 'discord.js'
import commands from './index'

/**
 * Show available commands in debug module
 */
export const Default = {
  execute: (msg: Message) => {
    let str =
      'Available commands: ' +
      commands.map((x) => '`' + x.name + '`').join(', ')
    return msg.reply(str)
  },
}
