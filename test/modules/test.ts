import { command, CommandClient, Module } from '../../src'
import { Message } from 'discord.js'

class Test extends Module {
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

  @command()
  test(msg: Message) {
    msg.reply('test')
  }
}

export function install(client: CommandClient) {
  return new Test()
}
