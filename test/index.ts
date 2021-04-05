import Discord from "discord.js"
import { command, CommandClient, Module } from "../dist"

class TestModule extends Module {
  @command()
  async test() {}
}

const client = new CommandClient(
  {
    intents: Discord.Intents.ALL,
  },
  {},
)
