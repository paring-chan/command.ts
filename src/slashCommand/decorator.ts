import { Context, Module } from '../structures'
import { ISlashCommandDecorator, ISlashCommandDecoratorOptions } from '..'
import { SLASH_COMMANDS_KEY } from '../constants'

export function slashCommand(
  opts: Partial<ISlashCommandDecoratorOptions> = {},
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
    const meta: ISlashCommandDecorator = {
      name: opts.name || (propertyKey as string),
      args: types.slice(1).map((x, i) => ({
        type: x,
      })),
      key: propertyKey as string,
    }
    const metas: ISlashCommandDecorator[] =
      Reflect.getMetadata(SLASH_COMMANDS_KEY, target) || []
    metas.push(meta)
    Reflect.defineMetadata(SLASH_COMMANDS_KEY, metas, target)
  }
}
