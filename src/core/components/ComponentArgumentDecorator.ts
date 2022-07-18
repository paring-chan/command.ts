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
