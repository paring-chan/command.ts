import { Message } from 'discord.js'
import { CommandClient } from '../../structures'

/**
 * Load module
 */
export default {
  name: 'load',
  execute: async (msg: Message, args: string[]) => {
    const client = msg.client as CommandClient
    let result = '```\n'
    let success = 0
    let failed = 0
    for (const arg of args) {
      try {
        await client.registry.loadModule(arg)
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
