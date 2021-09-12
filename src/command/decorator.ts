import { KCommands, KOptionals } from '../constants'
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

    const params: any[] = Reflect.getMetadata(
      'design:paramtypes',
      target,
      propertyKey,
    )

    const optionals: number[] =
      Reflect.getMetadata(KOptionals, target, propertyKey) || []

    const command = new Command(
      target as Module,
      Reflect.get(target, propertyKey),
      params.map((x, i) => ({
        type: x,
        optional: optionals.includes(i),
      })),
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

export const optional: ParameterDecorator = (
  target,
  propertyKey,
  parameterIndex,
) => {
  checkTarget(target)

  let properties: number[] = Reflect.getMetadata(
    KOptionals,
    target,
    propertyKey,
  )

  if (properties) {
    properties.push(parameterIndex)
  } else {
    properties = [parameterIndex]
    Reflect.defineMetadata(KOptionals, properties, target, propertyKey)
  }
}
