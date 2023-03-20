const
{
    EmbedBuilder
} = require('discord.js'),
{colors, emojis} = require('@config/config'),
schema = require('@schema/logger'),
chalk = require('chalk');

module.exports = async (client, interaction) => {
    await interaction.deferReply();
    const channel = interaction.options.getChannel('channel'),
    data = await schema.findOne({ guild_id: interaction.guild.id });

    if(data) {
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setColor(colors.red)
                .setDescription(`${emojis.cross} | Logger is already enabled for this server.`)
            ]
        });
    } else {
        await new schema({
            guild_id: interaction.guild.id,
            channel_id: channel.id
        }).save().catch((err) => {
            console.log(chalk.red(`[CLIENT] - could not save logger data data in database.\n${err}`))
        });
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setColor(colors.green)
                .setDescription(`${emojis.tick} | Logger has been enabled and ${channel} has set as log channel successfully.`)
            ]
        });
    }
}