import { HandlerAdapter } from '../interface'
import { Client, Message, User } from 'discord.js'
import { CommandClient } from '../structures'

export class DJSAdapter implements HandlerAdapter<Message> {
  constructor(public client: Client) {}

  init(client: CommandClient) {
    this.client.on('messageCreate', (msg) => client.handle(msg))
    this.client.once('ready', client.ready)
  }

  fetchOwners(): string[] {
    const o = this.client.application?.owner
    if (!o) return []
    if (o instanceof User) return [o.id]
    else return o.members.map((x) => x.id)
  }

  getCommandData(msg: Message) {
    return {
      message: msg,
      author: msg.author.id,
      content: msg.content,
    }
  }
}
