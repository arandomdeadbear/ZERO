const { readdirSync } = require('node:fs');
const { settings, secrets } = require('@config/config');
const { Routes, REST, PermissionsBitField } = require('discord.js');
const chalk = require('chalk');
const ascii = require('ascii-table');
const table = new ascii('SLASH COMMANDS');

module.exports = (client) => {
    const commands = [];
    readdirSync('./bot/commands/slash').forEach((folder) => {
        const commandFiles = readdirSync(`./bot/commands/slash/${folder}`).filter((file) => file.endsWith('.js'));
        for(const file of commandFiles) {
           const command = require(`@bot/commands/slash/${folder}/${file}`);
           if(command && command.name && command.description) {
            table.addRow(command.name, 'loaded');
            client.slashes.set(command.name, command);
            commands.push({
                name: command.name,
                description: command.description,
                type: command.type || 1,
                options: command.options ?? null,
                default_member_permissions: command.permissions ? PermissionsBitField.resolve(command.permissions).toString() : null
            });
           } else {
            console.log(chalk.red(`[BOT-SLASH] - could not load ${file}...\n[REASON] - missing required parameters.`));
            table.addRow(file, 'error');
            continue;
           }
        }
    });
    console.log(chalk.blue(table.toString()));

    //register slash commands
    let id;
    let token;
    if(settings.dev_mode) {
        token = process.env.TEST_TOKEN;
        id = secrets.test_client;
    } else {
        token = process.env.MAIN_TOKEN;
        id = secrets.main_client;
    }

    const rest = new REST({ version: '10' }).setToken(token);
    (async () => {
        try {
            if(settings.dev_mode) {
                var data = await rest.put(
                    Routes.applicationGuildCommands(id, secrets.server),
                    {
                        body: commands
                    }
                );
            } else {
                data = await rest.put(
                    Routes.applicationCommands(id),
                    {
                        body: commands
                    }
                )
            }
            console.log(chalk.green(`[BOT] - ${data.length} slash commands reloaded.`));
        } catch (err) {
            console.log(chalk.red(`[BOT] - something went wrong while registering slash commands.\n${err}`));
        }
    })();
}