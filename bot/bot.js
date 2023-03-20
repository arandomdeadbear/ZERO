const {
    Client,
    Collection,
    Partials,
    GatewayIntentBits
} = require('discord.js');
const { settings } = require('@config/config');
const chalk = require('chalk');

//create new cliet
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.DirectMessages
    ],
    partials: [
        Partials.User,
        Partials.GuildMember,
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ],
    allowedMentions: {
        repliedUser: false,
      },
      
      restRequestTimeout: 20000,
});

//client collections
client.events = new Collection();
client.slashes = new Collection();
client.commands = new Collection();
client.menus = new Collection();
client.buttons = new Collection();
client.snipes = new Collection();

//export client globally
module.exports = client;

//define handler file path and pass in client
[
    'event',
    'slash',
    'mongo',
    'command',
    'component'
].forEach((file) => {
    require(`@handler/bot/${file}`)(client);
});

//define token
var client_token;
if(settings.dev_mode) {
    client_token = process.env.TEST_TOKEN;
    console.log(chalk.cyan('[CLIENT] - client is in test mode.'));
} else {
    client_token = process.env.MAIN_TOKEN;
    console.log(chalk.cyan('[CLIENT] - client is in global mode.'));
}

//login to the bot
client.login(client_token).catch(err => {
    console.log(chalk.red('[CLIENT] - could not log into the bot, check your token and try again.\n' + err));
    process.exit();
})

//handle error
process.on('unhandledRejection', err => {
	console.log(chalk.red('[ERROR] - unhandled promise rejection.\n' + err));
});