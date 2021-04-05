import {Client, ClientOptions} from 'discord.js'

export class CommandClient extends Client {
    constructor(clientOptions: ClientOptions) {
        super(clientOptions)
    }
}