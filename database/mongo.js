const { connect, set } = require('mongoose');
const chalk = require('chalk');

(async () => {
  await set('strictQuery', true);
  await connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }).catch(err => {
    console.log(chalk.red(`[MONGO] - something went wrong connectiing to the database.\n${err}`));
  });
})()