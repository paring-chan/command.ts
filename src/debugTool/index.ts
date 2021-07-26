import { DebugModule } from './DebugModule'
import load from './commands/load'
import unload from './commands/unload'
import reload from './commands/reload'
import eval from './commands/eval'

export { DebugModule }

export const debugCommands = {
  load,
  unload,
  reload,
  eval,
}
