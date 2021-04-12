# Command.TS

Command.TS is command framework for discord.js.

You can make commands easily with decorators.

## Getting started

### Installation

You can install command.ts by running this command

<code-group>
<code-block title="YARN">
```bash
yarn add @pikostudio/command.ts
```
</code-block>

<code-block title="NPM">
```bash
npm i @pikostudio/command.ts
```
</code-block>
</code-group>

### Adding command.ts to your project

You can use `CommandClient` class to use command.ts features.

```typescript
import { CommandClient } from "@pikostudio/command.ts"

const client = new CommandClient()

client.login('TOKEN_HERE')
```

### Get started with creating your first module

```typescript
// modules/hello.ts

import { CommandClient, Module, command } from "@pikostudio/command.ts"
import { Message } from 'discord.js'

class HelloModule extends Module {
  constructor(private client: CommandClient) {
    super(__filename)
  }

  // command
  @command()
  async hello(msg: Message) {
    msg.reply(`Hello ${msg.author.username}!`)
  }
  
  // listener
  @listener('ready')
  ready() {
    console.log(`Bot ${this.client.user!.username} is ready!`)
  }
}

export function install(client: CommandClient) {
  return new HelloModule(client)
}
```
