const
{
    EmbedBuilder
} = require('discord.js'),
{colors, emojis} = require('@config/config'),
schema = require('@schema/chatbot'),
chalk = require('chalk');

module.exports = async (client, interaction) => {
    await interaction.deferReply();

    const data = await schema.findOne({ guild_id: interaction.guild.id });

    if(!data) {
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setColor(colors.red)
                .setDescription(`${emojis.cross} | ChatBot feature is not enabled for this server.`)
            ]
        });
    } else {
       data.delete().catch((err) => {
        console.log(chalk.red(`[CLIENT] - could not delete chat bot data from database.\n${err}`));
       });
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setColor(colors.green)
                .setDescription(`${emojis.tick} | ChatBot feature has been disabled for this server.`)
            ]
        });
    }
}