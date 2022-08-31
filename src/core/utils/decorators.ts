export const mergeMethodDecorators = (decorators: MethodDecorator[]): MethodDecorator => {
  return (target, key, descriptor) => {
    for (const decorator of decorators) {
      decorator(target, key, descriptor)
    }
  }
}
