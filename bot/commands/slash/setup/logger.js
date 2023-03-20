const { subcommand } = require('@utills/functions');

module.exports = {
	name: 'logger',
	description: 'configure logger in your server',
	type: 1,
	options: [
        {
            name: 'enable',
            description: 'enable logger in your server',
            type: 1,
            options: [
                {
                    name: 'channel',
                    description: 'select a channel to send the logs to.',
                    type: 7,
                    channel_types: [0],
                    required: true
                }
            ]
        },
        {
            name: 'disable',
            description: 'disable logger in your server',
            type: 1,
        }
    ],
	permissions: ['Administrator'],
	async execute(client, interaction) {
        subcommand(client, interaction);
    },
};