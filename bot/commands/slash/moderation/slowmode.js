const { subcommand } = require('@utills/functions');

module.exports = {
	name: 'slowmode',
	description: 'set or remove slowmode.',
	type: 1,
	options: [
        {
            name: 'add',
            description: 'add slowmodein a channel.',
            type: 1,
            options: [
                {
                    name: 'duration',
                    description:'slowmode duration value.',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: '5s',
                            value: '5'
                        },
                        {
                            name: '10s',
                            value: '10'
                        },
                        {
                            name: '15s',
                            value: '15'
                        },
                        {
                            name: '30s',
                            value: '30'
                        },
                        {
                            name: '1m',
                            value: '60'
                        },
                        {
                            name: '2m',
                            value: '120'
                        },
                        {
                            name: '5m',
                            value: '300'
                        },
                        {
                            name: '10m',
                            value: '600'
                        },
                        {
                            name: '15m',
                            value: '900'
                        },
                        {
                            name: '30m',
                            value: '1800'
                        },
                        {
                            name: '1h',
                            value: '3600'
                        },
                        {
                            name: '2h',
                            value: '7200'
                        },
                        {
                            name: '6h',
                            value: '21600'
                        }
                    ]
                },
                {
                    name: 'channel',
                    description: 'the channel to add slowmode to.',
                    type: 7,
                    channel_types: [0],
                }
            ]
        },
        {
            name: 'remove',
            description: 'the channel to remove slowmode from.',
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