import { command, CommandClient, Module, listener, rest } from '../../src'
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

  @listener('commandError')
  error(err: Error) {
    console.error(err)
  }

  @command()
  test(msg: Message, @rest asdf: string = 'wa sans') {
    console.log(asdf)
    msg.reply(asdf)
  }
}

export function install(client: CommandClient) {
  return new Test(client)
}
