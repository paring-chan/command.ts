import { ApplicationCommandOptionType, Client } from 'discord.js'
import { applicationCommand, ApplicationCommandComponent, CommandClient, moduleHook, option, Registry } from '../src'
import { listener } from '../src/core/listener'

class Test {
  @applicationCommand({
    name: 'test',
    description: 'wow this is test',
  })
  async testCommand(
    @option({
      name: 'hello',
      description: '와아',
      type: ApplicationCommandOptionType.String,
    })
    hello: string,
    world: string,
  ) {}

  @applicationCommand({
    name: 'test2',
    description: 'wow this is test wow',
  })
  async test2(
    @option({
      name: 'sans',
      description: '와',
      type: ApplicationCommandOptionType.String,
    })
    wa: string,
  ) {}

  @moduleHook('load')
  load() {
    console.log('load')
  }

  @moduleHook('unload')
  unload() {
    console.log('unload')
  }

  @listener({ event: 'test', emitter: 'discord' })
  testEvent() {
    console.log('test')
  }
}

const ext = new Test()

const client = new Client({ intents: [] })

const cc = new CommandClient(client)

const registry = cc.registry

const run = async () => {
  await registry.registerModule(ext)

  // listener test
  client.emit('test')

  await registry.unregisterModule(ext)

  // shold not work
  client.emit('test')
}

run()
