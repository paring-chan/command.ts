import { BaseComponent, createComponentDecorator } from '../core'

export type ApplicationCommandOptions = {
  name: string
  description: string
}

export class ApplicationCommandComponent extends BaseComponent<ApplicationCommandOptions> {
  defaultOptions() {
    return {
      name: '',
      description: '',
    }
  }
}

export const applicationCommand = createComponentDecorator(ApplicationCommandComponent)
