import { APIApplicationCommandOption } from 'discord.js'
import { createArgumentDecorator, ComponentArgumentDecorator } from '../core'

type Options = APIApplicationCommandOption

export class ApplicationCommandOption extends ComponentArgumentDecorator<Options> {}

export const option = createArgumentDecorator(ApplicationCommandOption)
