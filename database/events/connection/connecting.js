const chalk = require('chalk')

module.exports = {
  name: 'connecting',
  execute() {
    console.log(chalk.yellow('[MONGO] - connecting to database...'));
  },
};
