import {
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageButton,
} from 'discord.js'
import ts from 'typescript'
import * as util from 'util'

export default {
  name: 'eval',
  execute: async (msg: Message, args: string[]) => {
    let script = args.join(' ')
    let transpiler: (code: string) => string = (code) => code
    if (script.startsWith('```') && script.endsWith('```')) {
      script = script.slice(3, script.length - 3)
      if (script.startsWith('ts') || script.startsWith('typescript')) {
        script = script.slice(2)
        transpiler = (code) => ts.transpile(code)
      }
    }
    const code = transpiler(script)
    return new Promise((resolve) => resolve(eval(code)))
      .then((v) => {
        let returns: string = <string>v
        if (typeof v !== 'string') {
          returns = util.inspect(v, {
            compact: true,
          })
        }
        returns = returns.split(msg.client.token!).join('[secret]')

        return returns
      })
      .catch((reason: Error) => {
        return reason.stack
      })
      .then(async (res) => {
        const s = `${res}`
        let m: Message
        const components = [
          new MessageActionRow().addComponents(
            new MessageButton({
              customId: 'delete',
              style: 'DANGER',
              emoji: '🗑️',
            }),
          ),
        ]
        if (s.split('\n').length > 1) {
          m = await msg.reply({
            files: [new MessageAttachment(Buffer.from(s), 'out.txt')],
            components,
          })
        } else {
          m = await msg.reply({
            content: s,
            components,
          })
        }
        try {
          await m.awaitMessageComponent({
            componentType: 'BUTTON',
            filter: (i) =>
              i.customId === 'delete' && i.user.id === msg.author.id,
          })
          await m.delete()
        } catch {
          await m.edit({
            components: [],
          })
        }
      })
  },
}
