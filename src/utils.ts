import { Module } from './structures'
import { InvalidTargetError } from './error'

export const checkTarget = (target: Object) => {
  if (!(target instanceof Module)) throw new InvalidTargetError()
}
