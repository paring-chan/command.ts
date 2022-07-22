/*
* File: index.ts
* 
* Copyright (c) 2022-2022 pikokr
* 
* Licensed under MIT License. Please see more defails in LICENSE file.
*/

import { BaseComponent } from '../components/BaseComponent'
import { createComponentDecorator } from '../components/decoratorCreator'

type Options = { component: typeof BaseComponent<unknown>; type: Function; parameterless: boolean }

export class ConverterComponent extends BaseComponent<Options, Omit<Options, 'parameterless'> & { parameterless?: boolean }> {}

export const argConverter = createComponentDecorator(ConverterComponent)
