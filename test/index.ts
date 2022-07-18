import { ApplicationCommandOptionType } from 'discord.js'
import { applicationCommand, ApplicationCommandComponent, moduleHook, option, Registry } from '../src'

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
}

const ext = new Test()

const registry = new Registry()

const run = async () => {
  await registry.registerModule(ext)

  await registry.unregisterModule(ext)
}

run()
