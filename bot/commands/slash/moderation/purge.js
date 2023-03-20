const { EmbedBuilder } = require('discord.js'),
{colors, emojis} = require('@config/config'),
chalk = require('chalk');

module.exports = {
	name: 'purge',
	description: 'purges a number of messages from a channel.',
	type: 1,
	options: [
        {
            name: 'amount',
            description: 'the number of messages to purge.',
            type: 4,
            min_value: 1,
            max_value: 100,
            required: true
        },
        {
            name: 'channel',
            description: 'the channel to purge',
            type: 7,
            channel_types: [0],
            required: false
        }
    ],
	permissions: ['ManageMessages'],
	async execute(client, interaction) {
        const amount = interaction.options.getInteger('amount'),
        channel = interaction.options.getChannel('channel') ?? interaction.channel;
        try {
            await interaction.deferReply({ ephemeral: true });
            channel.bulkDelete(amount, true).then(async () => {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(colors.green)
                            .setDescription(`${emojis.tick} | Successfully deleted ${amount} messages from <#${channel.id}>.`)
                        ],
                        ephemeral: true
                    })
                });
        } catch (err) {
            await interaction.reply({
                embeds: new EmbedBuilder()
                .setColor(colors.red)
                .setDescription(`${emojis.cross} | Could not purge messages from ${channel}.`)
            });
            console.log(chalk.red(`[CLIENT] - could not bulk delete messages.\n${err}`));
        }
	},
};