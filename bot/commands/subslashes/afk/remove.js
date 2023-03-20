const { EmbedBuilder } = require('discord.js'),
{colors, emojis} = require('@config/config'),
schema = require('@schema/afk'),
chalk = require('chalk');


module.exports = async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const {guild, user, options} = interaction,
    data = await schema.findOne({
        guild_id: guild.id,
        user_id: user.id
    });
    if(data) {
        await data.delete().then(async () => {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(colors.green)
                    .setDescription(`${emojis.tick} | Welcome back, your AFK status has removed successfully.`)
                ]
            });
        }).catch((err) => {
            console.log(chalk.red(`[CLIENT] - something went wrong deleting an AFK data.`))
        });
    } else {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(colors.red)
                    .setDescription(`${emojis.cross} | Your status is not set as AFK.`)
                ]
            });
    }
}