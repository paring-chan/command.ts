import { Context, Module } from '../structures'
import { ICommandDecorator, ICommandDecoratorOptions } from '..'
import {
  COMMANDS_KEY,
  COMMANDS_OPTIONAL_KEY,
  COMMANDS_OWNER_ONLY_KEY,
  COMMANDS_REST_KEY,
} from '../constants'

export function command(
  opts: Partial<ICommandDecoratorOptions> = {},
): MethodDecorator {
  return (target, propertyKey) => {
    if (!(target instanceof Module)) {
      throw new TypeError('Class does not extends `Module` class.')
    }
    const types: Function[] = Reflect.getMetadata(
      'design:paramtypes',
      target,
      propertyKey,
    )
    const rest = Reflect.getMetadata(COMMANDS_REST_KEY, target, propertyKey)
    const optionals: number[] =
      Reflect.getMetadata(COMMANDS_OPTIONAL_KEY, target, propertyKey) || []
    if (optionals.includes(0)) {
      throw new Error('First property must not be optional')
    }
    if (typeof rest === 'number') {
      if (types.length - 1 !== rest)
        throw new Error('Only the last argument can be rest')
      if (types[rest] !== String)
        throw new Error('Rest argument type must be string')
      if (optionals.includes(rest))
        throw new Error('Rest argument cannot be optional')
    }

    let lastOpt = optionals[0] + 1

    for (const i of optionals) {
      if (lastOpt - i !== 1)
        throw new Error('Only the last arguments can be an optional argument')
      lastOpt = i
    }

    const meta: ICommandDecorator = {
      aliases: opts.aliases || [],
      brief: opts.brief,
      description: opts.description,
      name: opts.name || (propertyKey as string),
      usesCtx: types[0] === Context,
      args: types.slice(1).map((x, i) => ({
        type: x,
        optional: optionals.includes(i + 1),
        rest: i === rest,
      })),
      key: propertyKey as string,
    }
    const metas: ICommandDecorator[] =
      Reflect.getMetadata(COMMANDS_KEY, target) || []
    metas.push(meta)
    Reflect.defineMetadata(COMMANDS_KEY, metas, target)
  }
}

export const ownerOnly: MethodDecorator = (target, propertyKey) => {
  if (!(target instanceof Module)) {
    throw new TypeError('Class does not extends `Module` class.')
  }
  const list: Set<string> =
    Reflect.getMetadata(COMMANDS_OWNER_ONLY_KEY, target) || new Set()
  list.add(propertyKey as string)
  Reflect.defineMetadata(COMMANDS_OWNER_ONLY_KEY, list, target)
}

export const optional = (
  target: Object,
  propertyKey: string,
  parameterIndex: number,
) => {
  if (!(target instanceof Module)) {
    throw new TypeError('Class does not extends `Module` class.')
  }
  const indexes: number[] =
    Reflect.getMetadata(COMMANDS_OPTIONAL_KEY, target, propertyKey) || []
  indexes.push(parameterIndex)
  Reflect.defineMetadata(COMMANDS_OPTIONAL_KEY, indexes, target, propertyKey)
}

export const rest = (
  target: Object,
  propertyKey: string,
  parameterIndex: number,
) => {
  if (!(target instanceof Module)) {
    throw new TypeError('Class does not extends `Module` class.')
  }
  Reflect.defineMetadata(COMMANDS_REST_KEY, parameterIndex, target, propertyKey)
}
