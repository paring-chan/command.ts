import { BaseComponent } from '../components/BaseComponent'
import { createComponentDecorator } from '../components/decoratorCreator'

type Options<T> = { component: unknown; type: T; parameterless: boolean }

type OptionsArg<T> = Omit<Options<T>, 'parameterless'> & { parameterless?: boolean }

export class ConverterComponent<T> extends BaseComponent {
  options: Options<T>

  constructor(options: OptionsArg<T>) {
    super()
    this.options = options as Options<T>
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const argConverter = <T>(options: OptionsArg<T>) => createComponentDecorator(new ConverterComponent(options))

export { Options as ArgumentConvertOptions, OptionsArg as ArgumentConvertOptionsArg }
