import { checkTarget } from '../utils'
import { KListeners } from '../constants'
import { Listener } from './Listener'
import { Module } from '../structures'

export const listener = (event: string) => {
  return (
    target: Module,
    propertyKey: string,
    // descriptor: TypedPropertyDescriptor<any>,
  ) => {
    checkTarget(target)

    let properties: Listener[] = Reflect.getMetadata(KListeners, target)

    const listener = new Listener(event, Reflect.get(target, propertyKey))

    if (properties) {
      properties.push(listener)
    } else {
      properties = [listener]
      Reflect.defineMetadata(KListeners, properties, target)
    }
  }
}
