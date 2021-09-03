import { Module } from '../structures'

export class Command {
  execute(args: string[]) {
    return this.run.call(this.module, args)
  }

  constructor(
    public module: Module,
    private run: Function,
    public argTypes: any[],
    public name: string,
    public aliases: string[],
  ) {}
}
