const { EmbedBuilder, PermissionsBitField } = require('discord.js'),
{colors, emojis} = require('@config/config'),
chalk = require('chalk');

module.exports = async (client, interaction) => {
    const {options, guild, channel} = interaction,
    ch = options.getChannel('channel') ?? channel;
    await interaction.deferReply({ ephemeral: true });
    try {
        ch.permissionOverwrites.edit(guild.id, { SendMessages : true }).then(async () => {
            ch.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor(colors.green)
                    .setDescription(`${emojis.staff} | This channel has been unlocked.`)
                ]
            });
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(colors.green)
                    .setDescription(`${emojis.tick} | <#${ch.id}> has been unlocked successfully.`)
                ]
            })
        })
    } catch (err) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setColor(colors.red)
                .setDescription(`${emojis.cross} | Could not unlock.<#${ch.id}>, something went wrong.`)
            ]
        });
        console.log(err)
    }
}