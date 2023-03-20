const { readdirSync } = require('node:fs');
const chalk = require('chalk');
const ascii = require('ascii-table');
const table = new ascii('BOT EVENTS');

module.exports = (client) => {
    readdirSync('./bot/events/').forEach((folder) => {
        const eventFiles = readdirSync(`./bot/events/${folder}`).filter((file) => file.endsWith('.js'));
        for(const file of eventFiles) {
            const event = require(`@bot/events/${folder}/${file}`);
            if(event && event.name) {
                client.events.set(event.name, event);
                table.addRow(event.name, 'loaded');
                if(event.once) {
                    client.once(event.name, (...args) => event.execute(client, ...args));
                } else {
                    client.on(event.name, (...args) => event.execute(client, ...args));
                }
            } else {
                console.log(chalk.red(`[BOT] - could not load ${file}...\n[Reason] - missing required parameters.`));
                table.addRow(file, 'error');
            }
        }
    });
    console.log(chalk.blue(table.toString()));
}