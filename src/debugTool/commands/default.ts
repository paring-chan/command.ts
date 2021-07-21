import { Message } from 'discord.js'

export const Default = {
  execute: (msg: Message) => {
    let str = 'Available commands: `eval`'
    return msg.reply(str)
  },
}
