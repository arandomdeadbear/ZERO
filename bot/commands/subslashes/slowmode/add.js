const { EmbedBuilder } = require('discord.js'),
{colors, emojis} = require('@config/config'),
chalk = require('chalk');

module.exports = async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const duration = interaction.options.getString('duration'),
    time = parseInt(duration),
    channel = interaction.options.getChannel('channel') ?? interaction.channel;

    try {
        await channel.setRateLimitPerUser(time).then(async () => {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                .setColor(colors.green)
                .setDescription(`${emojis.setting} | Slowmode has been added to ${channel} successfully.`)
                ]
            });
        })
    } catch (err) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
            .setColor(colors.red)
            .setDescription(`${emojis.cross} | Could not add slowmode to ${channel}.`)
            ]
        });
        console.log(chalk.red(`[CLIENT] - could not add slowmode.`))
    }

}