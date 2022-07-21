import { createComponentDecorator } from '../core/components/decoratorCreator'
import { BaseComponent } from '../core/components/BaseComponent'

type TextCommandOptions = {
  name: string
  description?: string
}

export class TextCommandComponent extends BaseComponent<TextCommandOptions> {}

export const command = createComponentDecorator(TextCommandComponent)
