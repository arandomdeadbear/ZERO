const { subcommand } = require('@utills/functions');

module.exports = {
	name: 'chatbot',
	description: 'configure chatbot feature in your server',
	type: 1,
	options: [
        {
            name: 'enable',
            description: 'enable chatbot feature in your server',
            type: 1,
            options: [
                {
                    name: 'channel',
                    description: 'select a channel to set the chatbot to',
                    type: 7,
                    channel_types: [0],
                    required: true
                }
            ]
        },
        {
            name: 'disable',
            description: 'disable chatbot feature in your server',
            type: 1,
        }
    ],
	permissions: ['Administrator'],
	async execute(client, interaction) {
        subcommand(client, interaction);
    },
};