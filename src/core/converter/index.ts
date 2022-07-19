import { BaseComponent, createComponentDecorator } from '../components'

type Options = { component: typeof BaseComponent<unknown>; type: Function; parameterless: boolean }

export class ConverterComponent extends BaseComponent<Options, Options & { parameterless?: boolean }> {}

export const argConverter = createComponentDecorator(ConverterComponent)
