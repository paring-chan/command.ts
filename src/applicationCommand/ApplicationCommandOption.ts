import type { ApplicationCommandOptionData } from 'discord.js'
import { createArgumentDecorator, ComponentArgumentDecorator } from '../core'

type Options = ApplicationCommandOptionData

export class ApplicationCommandOption extends ComponentArgumentDecorator<Options> {}

export const option = createArgumentDecorator(ApplicationCommandOption)
