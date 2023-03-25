import { createComponentDecorator } from '../core/components/decoratorCreator'
import { BaseComponent } from '../core/components/BaseComponent'

export type TextCommandOptions = {
  name: string
  aliases?: string[]
  description?: string
}

export class TextCommandComponent extends BaseComponent {
  constructor(public options: TextCommandOptions) {
    super()
  }
}

export const command = (options: TextCommandOptions) => createComponentDecorator(new TextCommandComponent(options))
