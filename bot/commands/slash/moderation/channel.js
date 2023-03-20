const { subcommand } = require('@utills/functions');

module.exports = {
	name: 'channel',
	description: 'purges a number of messages from a channel.',
	type: 1,
	options: [
        {
            name: 'lock',
            description: 'lock a certain channel.',
            type: 1,
            options: [
                {
                    name: 'channel',
                    description: 'the channel to lock.',
                    type: 7,
                    channel_types: [0]
                }
            ]
        },
        {
            name: 'unlock',
            description: 'unlock a certain channel.',
            type:1,
            options: [
                {
                    name: 'channel',
                    description: 'the channel to unlock.',
                    type: 7,
                    channel_types: [0]
                }
            ]
        }
    ],
	permissions: ['ManageChannels'],
	async execute(client, interaction) {
        subcommand(client, interaction);
	},
};