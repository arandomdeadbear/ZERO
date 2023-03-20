const { EmbedBuilder } = require('discord.js'),
{colors, emojis} = require('@config/config'),
chalk = require('chalk');

module.exports = async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });
    channel = interaction.options.getChannel('channel') ?? interaction.channel,
    currentSM = channel.rateLimitPerUser;

    if(currentSM === 0) return interaction.editReply({
        embeds: [
            new EmbedBuilder()
            .setColor(colors.red)
            .setDescription(`${emojis.cross} | ${channel} doesn\'t have slowmode enabled.`)
        ]
    });

    try {
        await channel.setRateLimitPerUser(0).then(async () => {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                .setColor(colors.green)
                .setDescription(`${emojis.setting} | Slowmode has been removed from ${channel} successfully.`)
                ]
            });
        })
    } catch (err) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
            .setColor(colors.red)
            .setDescription(`${emojis.cross} | Could not remove slowmode from ${channel}.`)
            ]
        });
        console.log(chalk.red(`[CLIENT] - could not remove slowmode.`))
    }

}