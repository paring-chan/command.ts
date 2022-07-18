import { ApplicationCommandOptionType } from 'discord.js'
import { applicationCommand, option } from '../src'

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
}
