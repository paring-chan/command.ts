import { BaseComponent, createComponentDecorator } from '../components'

export class ListenerComponent extends BaseComponent<{ emitter: string }, { event: string }> {
  defaultOptions() {
    return { emitter: 'discord' }
  }
}

export const listener = createComponentDecorator(ListenerComponent)
