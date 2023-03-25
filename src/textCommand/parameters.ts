import { ComponentArgumentDecorator } from '../core'
import { createArgumentDecorator } from '../core'

export class TextCommandRestOption extends ComponentArgumentDecorator<void> {}

export const rest = createArgumentDecorator(TextCommandRestOption)
