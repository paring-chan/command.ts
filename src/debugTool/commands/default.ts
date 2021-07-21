import { Message } from 'discord.js'
import commands from './index'

export const Default = {
  execute: (msg: Message) => {
    let str =
      'Available commands: ' +
      commands.map((x) => '`' + x.name + '`').join(', ')
    return msg.reply(str)
  },
}
