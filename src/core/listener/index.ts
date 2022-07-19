import { BaseComponent, createComponentDecorator } from '../components'

export class ListenerComponent extends BaseComponent<{ emitter: string; event: string }, { emitter?: string; event: string }> {
  defaultOptions() {
    return { emitter: 'discord' }
  }

  constructor(options: ListenerComponent['options'], method: Function, argTypes: unknown[]) {
    super(
      {
        event: options.event,
        emitter: options.emitter ?? 'discord',
      },
      method,
      argTypes,
    )
  }
}

export const listener = createComponentDecorator(ListenerComponent)
