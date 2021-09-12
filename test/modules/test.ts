import { command, CommandClient, Module, listener } from '../../src'
import { Message } from 'discord.js'

class Test extends Module {
  constructor(private client: CommandClient) {
    super()
  }

  load() {
    console.log('load')
  }

  unload() {
    console.log('unload')
  }

  beforeReload() {
    console.log('before reload')
  }

  afterReload() {
    console.log('after reload')
  }

  @listener('ready')
  ready() {
    console.log(`Logged in as ${this.client.client.user!.tag}`)
  }

  @command()
  test(msg: Message) {
    msg.reply('test')
  }
}

export function install(client: CommandClient) {
  return new Test(client)
}
