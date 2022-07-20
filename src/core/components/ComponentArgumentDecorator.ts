/*
* File: ComponentArgumentDecorator.ts
* 
* Copyright (c) 2022-2022 pikokr
* 
* Licensed under MIT License. Please see more defails in LICENSE file.
*/

import _ from 'lodash'

export class ComponentArgumentDecorator<Options = unknown> {
  options: Options

  constructor(options: Partial<Options>) {
    if (typeof options === 'object') {
      this.options = _.merge(this.defaultOptions(), options)
    } else {
      this.options = options
    }
  }

  defaultOptions(): Options {
    return {} as unknown as Options
  }
}
