import { CommandInteraction, Message } from 'discord.js'
import type { CheckFunction, SlashCheckFunction } from './Command'
import { KCommandChecks, KSlashCommandChecks } from '../constants'

export const createCheckDecorator = (
  execute: ((msg: Message) => boolean | Promise<boolean>) | null,
  slashExecute?: (i: CommandInteraction) => boolean | Promise<boolean>,
): MethodDecorator => {
  return (target, propertyKey) => {
    if (execute) {
      let properties: CheckFunction[] = Reflect.getMetadata(KCommandChecks, target, propertyKey)
      if (properties) {
        properties.push(execute)
      } else {
        properties = [execute]
        Reflect.defineMetadata(KCommandChecks, properties, target, propertyKey)
      }
    }
    if (slashExecute) {
      let properties: SlashCheckFunction[] = Reflect.getMetadata(KSlashCommandChecks, target, propertyKey)
      if (properties) {
        properties.push(slashExecute)
      } else {
        properties = [slashExecute]
        Reflect.defineMetadata(KSlashCommandChecks, properties, target, propertyKey)
      }
    }
  }
}
