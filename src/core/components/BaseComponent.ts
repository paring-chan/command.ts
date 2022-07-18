import { Collection } from 'discord.js'
import _ from 'lodash'
import { ComponentArgument } from './ComponentArgument'

export class BaseComponent<Options = unknown> {
  options: Options

  method: Function

  argTypes: Collection<number, ComponentArgument> = new Collection()

  constructor(options: Partial<Options>, method: Function, argTypes: unknown[]) {
    if (typeof options === 'object') {
      this.options = _.merge(this.defaultOptions(), options)
    } else {
      this.options = options
    }
    this.method = method
    for (let i = 0; i < argTypes.length; i++) {
      const element = argTypes[i]
      this.argTypes.set(i, new ComponentArgument(element))
    }
  }

  defaultOptions(): Options {
    return ({} as unknown) as Options
  }

  execute(target: object, args: unknown[]) {
    return this.method.apply(target, args)
  }
}
