import { Context, Module } from '../structures'
import { ICommandDecorator, ICommandDecoratorOptions } from '..'

export function command(
  opts: Partial<ICommandDecoratorOptions> = {},
): MethodDecorator {
  return (target, propertyKey, descriptor) => {
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
      args: types.slice(1).map((x, y) => ({
        type: x,
        optional: false, // not implemented
      })),
    }
  }
}
