/*
 * File: index.ts
 *
 * Copyright (c) 2022-2022 pikokr
 *
 * Licensed under MIT License. Please see more defails in LICENSE file.
 */

import { BaseComponent } from '../components/BaseComponent'
import { createComponentDecorator } from '../components/decoratorCreator'

type Options = { component: unknown; type: Function; parameterless: boolean }

type OptionsArg = Omit<Options, 'parameterless'> & { parameterless?: boolean }

export class ConverterComponent extends BaseComponent {
  options: Options

  constructor(options: OptionsArg) {
    super()
    this.options = options as Options
  }
}

export const argConverter = (options: OptionsArg) => createComponentDecorator(new ConverterComponent(options))

export { Options as ArgumentConvertOptions, OptionsArg as ArgumentConvertOptionsArg }
