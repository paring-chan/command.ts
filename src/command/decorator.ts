import { Module } from "../structures"
import { ICommandDecoratorOptions } from ".."

export function command(
  opts: Partial<ICommandDecoratorOptions> = {},
): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    if (!(target instanceof Module)) {
      throw new TypeError("Command decorator must be used in `Module` class.")
    }
  }
}
