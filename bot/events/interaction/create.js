const { Events } = require('discord.js');
const chalk = require('chalk');

module.exports = {
  name: Events.InteractionCreate,
	once: false,
  async execute(client, interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.slashes.get(interaction.commandName);
      if (!command) return;
      try {
        command.execute(client, interaction);
      } catch (err) {
        console.log(chalk.red(`[CLIENT] - something went wrong executing slash command.\n${err}`));
      }
    } 
    else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (!button) return;
      try {
        button.execute(client, interaction);
      } catch (err) {
        console.log(chalk.red(`[CLIENT] - something went wrong executing button interaction.\n${err}`));
      }
    } else if(interaction.isStringSelectMenu()) {
      const menu = client.menus.get(interaction.customId);
      if(!menu) return console.log('no menu found')
      try {
        menu.execute(client, interaction);
      } catch (err) {
        console.log(chalk.red(`[CLIENT] - something went wrong executing menu interaction.\n${err}`));
      }
    } else {
      return;
    }
   
  },
};
