const {subcommand} = require('@utills/functions');

module.exports = {
    name: 'afk',
    description: 'set yourself as afk',
    type: 1,
    options: [
        {
            name: 'add',
            description: 'add yourself as afk.',
            type: 1,
            options: [
                {
                    name: 'reason',
                    description: 'your afk reason.',
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: 'remove',
            description: 'remove your afk status.',
            type: 1
        }
    ],
    permission: ['SendMessages'],
    async execute(client, interaction) {
        subcommand(client, interaction);
    },
};