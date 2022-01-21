import { MessageComponentExecutor, MessageComponentHandler } from './base'
import { checkTarget } from '../utils'
import { KMessageComponentHandlers } from '../constants'

export class SelectMenuInteractionHandler extends MessageComponentHandler {
  constructor(id: string, execute: MessageComponentExecutor) {
    super(id, 'SELECT_MENU', execute)
  }
}

export const messageSelectMenu = (id: string): MethodDecorator => {
  return (target, propertyKey) => {
    checkTarget(target)

    const handler = new SelectMenuInteractionHandler(id, Reflect.get(target, propertyKey))

    let properties: MessageComponentHandler[] = Reflect.getMetadata(KMessageComponentHandlers, target)

    if (properties) {
      properties.push(handler)
    } else {
      properties = [handler]
      Reflect.defineMetadata(KMessageComponentHandlers, properties, target)
    }
  }
}
