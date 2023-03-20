const
{
    EmbedBuilder
} = require('discord.js'),
{colors, emojis} = require('@config/config'),
schema = require('@schema/logger'),
chalk = require('chalk');

module.exports = async (client, interaction) => {
    await interaction.deferReply();

    const data = await schema.findOne({ guild_id: interaction.guild.id });

    if(!data) {
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setColor(colors.red)
                .setDescription(`${emojis.cross} | Logger is not enabled in this server.`)
            ]
        });
    } else {
       data.delete().catch((err) => {
        console.log(chalk.red(`[CLIENT] - could not delete logger data from database.\n${err}`));
       });
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setColor(colors.green)
                .setDescription(`${emojis.tick} | Logger has been disabled for this server.`)
            ]
        });
    }
}