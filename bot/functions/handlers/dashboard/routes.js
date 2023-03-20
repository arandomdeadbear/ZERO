const { readdirSync } = require('node:fs');
const chalk = require('chalk');
const ascii = require('ascii-table');
const table = new ascii('ROUTES')

module.exports = (app) => {
  readdirSync('./dashboard/routes').forEach((folder) => {
    const eventFiles = readdirSync(`./dashboard/routes/${folder}`).filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
      const routes = require(`@dashboard/routes/${folder}/${file}`);
      if(routes && routes.name) {
        app.get(routes.name, routes.execute);
        table.addRow('Loaded', routes.name);
      } else {
        console.log(chalk.red('[DASHBOARD] - could not load route in ' + file));
        table.addRow('ERROR', file);
      }
    }
  });
  console.log(chalk.blue(table.toString()));
};