import { ComponentArgumentDecorator } from './ComponentArgumentDecorator'

export class ComponentArgument {
  decorators: ComponentArgumentDecorator[] = []

  constructor(public type: unknown) {}
}
