/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { Module } from './structures'
import { InvalidTargetError } from './error'

export const checkTarget = (target: Object) => {
  if (!(target instanceof Module)) throw new InvalidTargetError()
}
