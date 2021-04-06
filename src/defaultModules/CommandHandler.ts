import { CommandClient, Module } from '../structures'
import { listener } from '../listener'
import { Message } from 'discord.js'

export class CommandHandler extends Module {
  constructor(private client: CommandClient) {
    super()
  }

  @listener('message')
  async onMessage(msg: Message) {
    const prefix = this.client.commandOptions.prefix
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
    const commandArgs = cmd.args
    const parsedArgs: any[] = []
    args.forEach((v, i) => {
      const arg = commandArgs[i]
    })
  }
}
