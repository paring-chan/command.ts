import { Message } from 'discord.js'

export const Default = {
  execute: (msg: Message) => {
    let str = `와!`
    return msg.reply(str)
  },
}
