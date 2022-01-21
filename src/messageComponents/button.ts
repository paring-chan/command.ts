import { MessageComponentExecutor, MessageComponentHandler } from './base'
import { checkTarget } from '../utils'
import { KMessageComponentHandlers } from '../constants'

export class ButtonInteractionHandler extends MessageComponentHandler {
  constructor(id: string, execute: MessageComponentExecutor) {
    super(id, 'BUTTON', execute)
  }
}

export const messageButton = (id: string): MethodDecorator => {
  return (target, propertyKey) => {
    checkTarget(target)

    const handler = new ButtonInteractionHandler(id, Reflect.get(target, propertyKey))

    let properties: MessageComponentHandler[] = Reflect.getMetadata(KMessageComponentHandlers, target)

    if (properties) {
      properties.push(handler)
    } else {
      properties = [handler]
      Reflect.defineMetadata(KMessageComponentHandlers, properties, target)
    }
  }
}
