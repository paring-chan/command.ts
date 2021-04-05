export type CommandClientOptions = {
  owners?: string[] | 'auto'
}

export interface ICommandDecoratorOptions {
  aliases: string[]
  brief: string
  description: string
}

export interface ICommandArgument {
  type: Function
  optional: boolean
}

export interface ICommandDecoratorMetadata {
  name: string
  optional: boolean
  usesCtx: boolean
}
