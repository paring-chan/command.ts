import { BaseComponent, createComponentDecorator } from '../components'

export class ListenerComponent extends BaseComponent<{ emitter: string }, { event: string }> {
  defaultOptions() {
    return { event: '', emitter: 'discord' }
  }
}

export const listener = createComponentDecorator(ListenerComponent)
