import { Context, Module } from '../structures'
import { ISlashCommandDecorator, ISlashCommandDecoratorOptions } from '..'
import { SLASH_COMMANDS_KEY } from '../constants'

/**
 * Slash Command Decorator
 * @param opts
 */
export function slashCommand(
  opts: ISlashCommandDecoratorOptions,
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
      key: propertyKey as string,
      description: opts.description,
      options: opts.options,
    }
    const metas: ISlashCommandDecorator[] =
      Reflect.getMetadata(SLASH_COMMANDS_KEY, target) || []
    metas.push(meta)
    Reflect.defineMetadata(SLASH_COMMANDS_KEY, metas, target)
  }
}
