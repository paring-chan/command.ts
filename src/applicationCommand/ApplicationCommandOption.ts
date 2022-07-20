/*
* File: ApplicationCommandOption.ts
* 
* Copyright (c) 2022-2022 pikokr
* 
* Licensed under MIT License. Please see more defails in LICENSE file.
*/

import { APIApplicationCommandOption } from 'discord.js'
import { createArgumentDecorator, ComponentArgumentDecorator } from '../core'

type Options = APIApplicationCommandOption

export class ApplicationCommandOption extends ComponentArgumentDecorator<Options> {}

export const option = createArgumentDecorator(ApplicationCommandOption)
