const
{
    EmbedBuilder
} = require('discord.js'),
{colors, emojis} = require('@config/config'),
schema = require('@schema/chatbot'),
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
                .setDescription(`${emojis.cross} | ChatBot feature is already enabled for this server.`)
            ]
        });
    } else {
        await new schema({
            guild_id: interaction.guild.id,
            channel_id: channel.id
        }).save().catch((err) => {
            console.log(chalk.red(`[CLIENT] - could not save chat bot data in database.\n${err}`))
        });
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setColor(colors.green)
                .setDescription(`${emojis.tick} | ChatBot feature has been enabled and ${channel} has set for chat bot channel successfully.`)
            ]
        });
    }
}