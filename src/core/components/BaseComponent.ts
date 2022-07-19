import { Collection } from 'discord.js'
import _ from 'lodash'
import { ComponentArgument } from './ComponentArgument'

export class BaseComponent<Options = unknown, RequiredOptions = unknown> {
  options: Options & RequiredOptions

  method: Function

  argTypes: Collection<number, ComponentArgument> = new Collection()

  constructor(options: Partial<Options> & RequiredOptions, method: Function, argTypes: unknown[]) {
    if (typeof options === 'object') {
      this.options = _.merge(this.defaultOptions(), options)
    } else if (typeof options === 'string') {
      this.options = options as this['options']
    } else {
      this.options = null as unknown as this['options']
    }
    this.method = method
    for (let i = 0; i < argTypes.length; i++) {
      const element = argTypes[i]
      this.argTypes.set(i, new ComponentArgument(element))
    }
  }

  defaultOptions(): Options & Partial<RequiredOptions> {
    return {} as unknown as ReturnType<this['defaultOptions']>
  }

  execute(target: object, args: unknown[]) {
    return this.method.apply(target, args)
  }
}
