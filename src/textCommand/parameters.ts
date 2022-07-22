/*
* File: parameters.ts
* 
* Copyright (c) 2022-2022 pikokr
* 
* Licensed under MIT License. Please see more defails in LICENSE file.
*/

import { ComponentArgumentDecorator } from '../../dist'
import { createArgumentDecorator } from '../core'

export class TextCommandRestOption extends ComponentArgumentDecorator<void> {}

export const rest = createArgumentDecorator(TextCommandRestOption)
