import Discord from 'discord.js'
import {CommandClient} from "../dist";

const client = new CommandClient({
    intents: Discord.Intents.ALL
}, {})
