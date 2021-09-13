import { BuiltInModule } from './BuiltInModule'
import { argumentConverter } from '../command'
import { Message } from 'discord.js'

export class BuiltinCommandConverters extends BuiltInModule {
  @argumentConverter(Message, false)
  message(msg: Message) {
    return msg
  }

  @argumentConverter(String)
  string(msg: Message, arg: string) {
    return arg
  }
}
