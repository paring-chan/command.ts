import { KArgumentConverters, KCommands, KOptionals } from '../constants'
import { Command } from './Command'
import { checkTarget } from '../utils'
import { ArgumentConverter } from './ArgumentConverter'

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

export const argumentConverter = (type: object, requireParameter = true) => {
  return (
    target: Object,
    propertyKey: string,
    // descriptor: TypedPropertyDescriptor<any>,
  ) => {
    checkTarget(target)

    let properties: ArgumentConverter[] = Reflect.getMetadata(
      KArgumentConverters,
      target,
    )

    const converter = new ArgumentConverter(
      type,
      Reflect.get(target, propertyKey),
      !requireParameter,
    )

    if (properties) {
      properties.push(converter)
    } else {
      properties = [converter]
      Reflect.defineMetadata(KArgumentConverters, properties, target)
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
