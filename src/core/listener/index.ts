/*
* File: index.ts
* 
* Copyright (c) 2022-2022 pikokr
* 
* Licensed under MIT License. Please see more defails in LICENSE file.
*/

import { BaseComponent } from '../components/BaseComponent'
import { createComponentDecorator } from '../components/decoratorCreator'

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
