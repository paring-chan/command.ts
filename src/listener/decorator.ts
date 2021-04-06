import { Module } from '../structures'
import { IListener } from '..'
import { LISTENERS_KEY } from '../constants'

export function listener(event: string): MethodDecorator {
  return (target, propertyKey) => {
    if (!(target instanceof Module)) {
      throw new TypeError('Class does not extend `Module` class.')
    }
    const meta: IListener = {
      event,
      execute: Reflect.get(target, propertyKey),
      module: target,
      id: target.constructor.name + ':' + (propertyKey as string),
    }
    const metas: IListener[] = Reflect.getMetadata(LISTENERS_KEY, target) || []
    metas.push(meta)
    Reflect.defineMetadata(LISTENERS_KEY, metas, target)
  }
}
