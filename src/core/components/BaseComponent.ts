import { Collection } from 'discord.js'
import _ from 'lodash'
import { ComponentArgument } from './ComponentArgument'

export class BaseComponent<Options = unknown, OptionsArg = Options> {
  options: Options

  method: Function

  argTypes: Collection<number, ComponentArgument> = new Collection()

  constructor(options: OptionsArg, method: Function, argTypes: unknown[]) {
    this.options = this.convertOptions(options)

    this.method = method
    for (let i = 0; i < argTypes.length; i++) {
      const element = argTypes[i]
      this.argTypes.set(i, new ComponentArgument(element))
    }
  }

  convertOptions(options: OptionsArg): Options {
    return options as unknown as Options
  }

  execute(target: object, args: unknown[]) {
    return this.method.call(target, ...args)
  }
}
