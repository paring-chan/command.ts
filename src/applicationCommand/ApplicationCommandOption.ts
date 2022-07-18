import { APIApplicationCommandOption } from 'discord.js'
import { createArgumentDecorator } from '../core'
import { ComponentArgumentDecorator } from '../core/components/ComponentArgumentDecorator'

type Options = APIApplicationCommandOption

export class ApplicationCommandOption extends ComponentArgumentDecorator<Options> {}

export const option = createArgumentDecorator(ApplicationCommandOption)
