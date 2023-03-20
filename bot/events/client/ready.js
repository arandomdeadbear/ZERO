const { Events } = require('discord.js');
const chalk = require('chalk');
module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(chalk.green(`[BOT] - ${client.user.username.toLowerCase()} is ready.`));
        require('@dashboard/server.js');
    }
}