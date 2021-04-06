import { Module } from '../structures'
import { IListener, ListenerDecorator } from '..'
import { LISTENERS_KEY } from '../constants'

export function listener(event: string): MethodDecorator {
  return (target, propertyKey) => {
    if (!(target instanceof Module)) {
      throw new TypeError('Class does not extend `Module` class.')
    }
    const meta: ListenerDecorator = {
      event,
      id: target.constructor.name + ':' + (propertyKey as string),
      key: propertyKey as string,
    }
    const metas: IListener[] = Reflect.getMetadata(LISTENERS_KEY, target) || []
    metas.push(meta)
    Reflect.defineMetadata(LISTENERS_KEY, metas, target)
  }
}
