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

export { Options as ListenerOptions, OptionsArg as ListenerOptionsArg }
