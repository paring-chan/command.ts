import { Message } from 'discord.js'
import * as os from 'os'
import { shellInstances } from '../store'
import _ from 'lodash'

function setCharAt(str: string, index: number, chr: string) {
  if (index > str.length - 1) return str
  return str.substring(0, index) + chr + str.substring(index + 1)
}

export default {
  name: 'shell',
  execute: async (msg: Message, args: string[]) => {
    const pty = await import('node-pty').catch(() => null)
    if (!pty) {
      return msg.reply('node-pty package not found.')
    }
    const shell =
      process.env.SHELL ||
      (os.platform() === 'win32' ? 'powershell.exe' : 'bash')
    const command = args.shift()
    if (!command) {
      if (!shellInstances.length) {
        return msg.reply('Shell instances not available. please create one.')
      } else {
        return msg.reply(
          `Available shell instances: ${shellInstances
            .map((x) => `\`${x.name}\``)
            .join(', ')}`,
        )
      }
    }
    if (command === 'spawn') {
      const name = args.join(' ')
      if (!name) return msg.reply('Instance name is required.')
      if (shellInstances.find((x) => x.name === name))
        return msg.reply('Shell already exists')
      const m = await msg.reply({
        allowedMentions: {
          repliedUser: false,
        },
        content: 'Spawning shell instance....',
      })
      const tty = pty.spawn(shell, [], {
        name: name,
        cols: 80,
        rows: 20,
      })
      let buff = Buffer.alloc(0)
      tty.onData((e) => {
        buff = Buffer.concat([buff, Buffer.from(e)])
        let str = buff.toString().split('\n')
        if (str.length > tty.rows) {
          str = str.slice(str.length - tty.rows)
        }
        let data = new Array(tty.rows).fill(' '.repeat(tty.cols))
        str.forEach((x, i) => {
          x.split('').forEach((y, j) => {
            data[i] = setCharAt(data[i], j, str[i][j])
          })
        })
        msg.channel.send(buff.toString())
        msg.channel.send('```\n' + data.join('\n') + '```')
      })
      shellInstances.push({
        name,
        pty: tty,
      })
      await m.edit('Spawned! Attach to use it.')
    } else if (command === 'kill') {
      const name = args.join(' ')
      if (!name) return msg.reply('Instance name is required.')
      const i = shellInstances.find((x) => x.name === name)
      if (!i) return msg.reply('Shell not found.')
      i.pty.kill()
      _.remove(shellInstances, i)
      await msg.reply('Killed.')
    }
  },
}
