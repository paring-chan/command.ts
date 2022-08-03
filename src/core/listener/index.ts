/*
 * File: index.ts
 *
 * Copyright (c) 2022-2022 pikokr
 *
 * Licensed under MIT License. Please see more defails in LICENSE file.
 */

import _ from 'lodash'
import { BaseComponent } from '../components/BaseComponent'
import { createComponentDecorator } from '../components/decoratorCreator'

type Options = { emitter: string; event: string }

type OptionsArg = { emitter?: string; event: string }

export class ListenerComponent extends BaseComponent {
  options: Options

  constructor(options: OptionsArg) {
    super()

    this.options = _.merge({ emitter: 'discord' }, options)
  }
}

export const listener = (options: OptionsArg) => createComponentDecorator(new ListenerComponent(options))
