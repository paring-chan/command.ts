import { KCommands } from '../constants'
import { Module } from '../structures'
import { Command } from './Command'
import { checkTarget } from '../utils'

type CommandOptions = {
  name: string
  aliases: string[]
}

export const command = (options: Partial<CommandOptions> = {}) => {
  return (
    target: Object,
    propertyKey: string,
    // descriptor: TypedPropertyDescriptor<any>,
  ) => {
    checkTarget(target)

    let properties: Command[] = Reflect.getMetadata(KCommands, target)

    const params = Reflect.getMetadata('design:paramtypes', target, propertyKey)

    const command = new Command(
      target as Module,
      Reflect.get(target, propertyKey),
      params,
      options.name || propertyKey,
      options.aliases || [],
    )

    if (properties) {
      properties.push(command)
    } else {
      properties = [command]
      Reflect.defineMetadata(KCommands, properties, target)
    }
  }
}
