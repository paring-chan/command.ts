import { KArgumentConverters, KCommands, KOptionals, KRest } from '../constants'
import { Command } from './Command'
import { checkTarget } from '../utils'
import { ArgumentConverter } from './ArgumentConverter'
import { Module } from '../structures'
import { createCheckDecorator } from './utils'

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

    const params: any[] = Reflect.getMetadata('design:paramtypes', target, propertyKey)

    const optionals: number = Reflect.getMetadata(KOptionals, target, propertyKey) || -1

    const rest = Reflect.getMetadata(KRest, target, propertyKey) || -1

    const command = new Command(
      Reflect.get(target, propertyKey),
      params.map((x, i) => ({
        type: x,
        optional: optionals === -1 ? false : optionals <= i,
        rest: rest === -1 ? false : rest === i,
      })),
      options.name || propertyKey,
      options.aliases || [],
      target as Module,
      propertyKey,
    )

    if (properties) {
      properties.push(command)
    } else {
      properties = [command]
      Reflect.defineMetadata(KCommands, properties, target)
    }
  }
}

export const argumentConverter = (type: object, requireParameter = true) => {
  return (
    target: Object,
    propertyKey: string,
    // descriptor: TypedPropertyDescriptor<any>,
  ) => {
    checkTarget(target)

    let properties: ArgumentConverter[] = Reflect.getMetadata(KArgumentConverters, target)

    const converter = new ArgumentConverter(type, Reflect.get(target, propertyKey), !requireParameter)

    if (properties) {
      properties.push(converter)
    } else {
      properties = [converter]
      Reflect.defineMetadata(KArgumentConverters, properties, target)
    }
  }
}

export const optional: ParameterDecorator = (target, propertyKey, parameterIndex) => {
  checkTarget(target)

  Reflect.defineMetadata(KOptionals, parameterIndex, target, propertyKey)
}

export const rest: ParameterDecorator = (target, propertyKey, parameterIndex) => {
  checkTarget(target)

  const params: any[] = Reflect.getMetadata('design:paramtypes', target, propertyKey)

  if (params.length - 1 !== parameterIndex) throw new Error('Rest decorator must be used at last argument.')

  if (params[parameterIndex] !== String) throw new Error('Rest argument type must be "String"')

  Reflect.defineMetadata(KRest, parameterIndex, target, propertyKey)
}

export const ownerOnly = createCheckDecorator((msg) => msg.data.cts.owners.includes(msg.author.id))
