const { EmbedBuilder } = require('discord.js'),
      { emojis, colors } = require('@config/config'),
        schema = require('@schema/leavelog'),
        chalk = require('chalk');

module.exports = {
	name: 'leavelog',
	description: 'configure leavelog feature in your server',
	type: 1,
	options: [
        {
            name: 'enable',
            description: 'enable leavelog feature in your server',
            type: 1,
            options: [
                {
                    name: 'channel',
                    description: 'select a channel to set leavelog to',
                    type: 7,
                    channel_types: [0],
                    required: true
                },
                {
                    name: 'image',
                    description: 'send an image for leavelog-card',
                    type: 11
                }
            ]
        },
        {
            name: 'disable',
            description: 'disable leavelog feature in your server',
            type: 1
        }
    ],
	permissions: ['Administrator'],
	async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: true });
        const { guild } = interaction,
                data = await schema.findOne({ guild_id: guild.id});

        if(interaction.options.getSubcommand() === 'enable') {
            const channel = interaction.options.getChannel('channel'),
                  image = interaction.options.getAttachment('image');
                  
            if(data) {
                await interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                           .setColor(colors.red)
                           .setDescription(`${emojis.cross} | Leavelog is already enabled in this server.`)
                    ]
                });
                return;
            } else {
                await new schema({
                    guild_id: guild.id,
                    channel_id: channel.id,
                    image_url: image ? image.url : null
                }).save().then(async () => {
                    await interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                               .setColor(colors.green)
                               .setDescription(`${emojis.tick} | Leavelog has been enabled and ${channel} has been set as leavelog channel.`)
                        ]
                    });
                }).catch((err) => {
                    console.log(chalk(`[CLIENT] - something went wrong setting up leavelog.\n${err}`));
                })
            }
        } else if(interaction.options.getSubcommand() === 'disable') {
            if(data) {
                await data.delete().then(async () => {
                    await interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                               .setColor(colors.green)
                               .setDescription(`${emojis.tick} | Leavelog has been disabled and data has been deleted.`)
                        ]
                    });
                }).catch(console.error)
            } else {
                await interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                           .setColor(colors.red)
                           .setDescription(`${emojis.cross} | Leavelog is not enabled in this server.`)
                    ]
                })
            }
        }
    },
};