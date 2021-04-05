import { Context, Module } from '../structures'
import { ICommandDecorator, ICommandDecoratorOptions } from '..'
import { COMMANDS_KEY } from '../constants'

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
    const meta: ICommandDecorator = {
      aliases: opts.aliases || [],
      brief: opts.brief,
      description: opts.description,
      name: propertyKey as string,
      usesCtx: types[0] === Context,
      args: types.slice(1).map((x) => ({
        type: x,
        optional: false, // not implemented
      })),
    }
    const metas: ICommandDecorator[] =
      Reflect.getMetadata(COMMANDS_KEY, target) || []
    metas.push(meta)
    Reflect.defineMetadata(COMMANDS_KEY, metas, target)
  }
}
