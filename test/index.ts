import { ApplicationCommandOptionType } from 'discord.js'
import { applicationCommand, getComponentStore, option } from '../src'

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
}

const ext = new Test()

const store = getComponentStore(ext)

console.log(store)
