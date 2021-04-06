import { Module } from '../structures'
import { IArgConverterDecorator } from '../types'
import { ARG_CONVERTER_KEY } from '../constants'

export function argConverter(type: Function): MethodDecorator {
  return (target, propertyKey) => {
    if (!(target instanceof Module)) {
      throw new TypeError('Class does not extend `Module` class.')
    }
    const meta: IArgConverterDecorator = {
      type,
      key: propertyKey as string,
    }
    const metas: IArgConverterDecorator[] =
      Reflect.getMetadata(ARG_CONVERTER_KEY, target) || []
    metas.push(meta)
    Reflect.defineMetadata(ARG_CONVERTER_KEY, metas, target)
  }
}
