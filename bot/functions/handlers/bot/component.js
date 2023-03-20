const { readdirSync } = require('fs'),
chalk = require('chalk');

module.exports = (client) => {
  readdirSync('./bot/components/buttons').forEach((dir) => {
    const buttonFiles = readdirSync(`./bot/components/buttons/${dir}`).filter(
      (file) => file.endsWith('.js')
    );

    for (const file of buttonFiles) {
      const button = require(`../../../components/buttons/${dir}/${file}`);
      if (button.data.name) {
        client.buttons.set(button.data.name, button);
      } else {
        console.log(chalk.red(`[CLIENT] - could not find name in ${file}.`));
      }
    }
  });

  readdirSync('./bot/components/menus').forEach((dir) => {
    const menuFiles = readdirSync(`./bot/components/menus/${dir}`).filter(
      (file) => file.endsWith('.js')
    );

    for (const file of menuFiles) {
      const menu = require(`../../../components/menus/${dir}/${file}`);
      if (menu.data.name) {
        client.menus.set(menu.data.name, menu);
      } else {
        console.log(chalk.red(`[CLIENT] - could not find name in ${file}.`));
      }
    }
  });

};
