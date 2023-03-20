const { readdirSync } = require('node:fs');
const chalk = require('chalk');
const ascii = require('ascii-table');
const table = new ascii('MESSAGE COMMANDS');

module.exports = (client) => {
    readdirSync('./bot/commands/message/').forEach((folder) => {
        const commandFiles = readdirSync(`./bot/commands/message/${folder}`).filter((file) => file.endsWith('.js'));
        for(const file of commandFiles) {
            const command = require(`@bot/commands/message/${folder}/${file}`);
            if(command && command.name) {
                table.addRow(command.name, 'loaded');
                client.commands.set(command.name, command);
            } else {
                table.addRow(file, 'error');
                console.log(chalk.red(`[BOT] - could not load ${file}...\n[REASON] - missing parameters.`));
            }
        }
    });
    console.log(chalk.blue(table.toString()));
}