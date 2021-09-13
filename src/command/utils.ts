import { Message } from 'discord.js'
import type { CheckFunction } from './Command'
import { KCommandChecks } from '../constants'

export const createCheckDecorator = (execute: (msg: Message) => boolean | Promise<boolean>): MethodDecorator => {
  return (target, propertyKey) => {
    let properties: CheckFunction[] = Reflect.getMetadata(KCommandChecks, target, propertyKey)
    if (properties) {
      properties.push(execute)
    } else {
      properties = [execute]
      Reflect.defineMetadata(KCommandChecks, properties, target, propertyKey)
    }
  }
}
