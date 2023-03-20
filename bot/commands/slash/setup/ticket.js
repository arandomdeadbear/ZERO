const
{
    EmbedBuilder
} = require('discord.js'),
{colors, emojis} = require('@config/config'),
schema = require('@schema/ticket'),
chalk = require('chalk');


module.exports = {
	name: 'ticket',
	description: 'configure ticket system in your server',
	type: 1,
	options: [
        {
            name: 'enable',
            description: 'enable ticket system in your server',
            type: 1,
            options: [
                {
                    name: 'channel',
                    description: 'select a channel to set the ticket panel',
                    type: 7,
                    channel_types: [0],
                    required: true
                },
                {
                    name: 'moderator',
                    description: 'select mod role who\'ll be able to access tickets.',
                    type: 9,
                    required: true
                },
                {
                    name: 'message',
                    description: 'ticket panel message',
                    type: 3,
                    max_length: 4096
                }
            ]
        },
        {
            name: 'disable',
            description: 'disable ticket feature in your server',
            type: 1
        }
    ],
	permissions: ['Administrator'],
	async execute(client, interaction) {

        await interaction.deferReply({ ephemeral: true });

        const { guild, member, user } = interaction,
                data = await schema.findOne({ guild_id: guild.id});

        if(interaction.options.getSubcommand() === 'enable') {
            const panel = interaction.options.getChannel('channel'),
                  mod = interaction.options.getMentionable('moderator'),
                  text = interaction.options.getString('message') ?? 'Please create a ticket if you need help with anything regarding the server.';

            if(data) {
                await interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(colors.red)
                        .setDescription(`${emojis.cross} | A ticket panel already exists in this server.`)
                    ]
                });
                return;
            } else {
                await new schema({
                    guild_id: guild.id,
                    panel_id: panel.id,
                    mode_role: mod.id,
                    panel_message: text ?? null
                }).save().then(async() => {
                    await interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(colors.green)
                            .setDescription(`${emojis.tick} | Ticket panel has been created in ${panel}.`)
                        ]
                    });
                    await panel.send({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(colors.main)
                            .setDescription(text)
                        ]
                    })
                }).catch(err => {
                    console.log(chalk.red(`[CLIENT] - error occured saving ticket data.\n${err}`));
                })
            }
        } else  if(interaction.options.getSubcommand() === 'disable') {
            if(data) {
                await data.delete().then(async() => {
                    await interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(colors.green)
                            .setDescription(`${emojis.tick} | Ticket system has been disabled and the panel has been deleted.`)
                        ]
                    });
                }).catch((err) => {
                    console.log(chalk.red(`[CLIENT] - error occured deleting ticket data.\n${err}`));
                });
            } else {
                await interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(colors.red)
                        .setDescription(`${emojis.cross} | Ticket system isn\'t enabled in this server.`)
                    ]
                });

                return;
            }
        }
    },
};