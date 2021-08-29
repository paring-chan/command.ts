import { Message } from 'discord.js'
import { CommandClient } from '../../structures'
import path from 'path'

/**
 * Unload module
 */
export default {
  name: 'unload',
  execute: async (msg: Message, args: string[]) => {
    const client = msg.client as CommandClient
    let result = '```\n'
    let success = 0
    let failed = 0
    let all = false
    if (args[0] === '~') {
      args = client.registry.modules
        .filter((x) => require(x.__path).loaded)
        .map((x) => x.__path && require(x.__path).loaded)
      all = true
    }
    for (const arg of args) {
      const module = client.registry.modules.find(
        (x) =>
          x.__path ===
          require.resolve(all ? arg : path.join(client.rootPath, arg)),
      )
      if (!module) {
        result += `🚫 ${arg} - Not Found\n`
        failed++
        continue
      }
      try {
        await client.registry.unloadModule(module)
        result += `✅ ${module.constructor.name}(${arg}) - Successful\n`
        success++
      } catch (e: any) {
        result += `🚫 ${arg} - ${e.message}\n`
        failed++
      }
    }
    result += `\`\`\`\n${success} successful, ${failed} failed.`
    await msg.reply(result)
  },
}
