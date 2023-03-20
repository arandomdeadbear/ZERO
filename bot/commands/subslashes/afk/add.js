const { EmbedBuilder } = require('discord.js'),
{colors, emojis} = require('@config/config'),
schema = require('@schema/afk'),
chalk = require('chalk');


module.exports = async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const {guild, user, options} = interaction,
    reason = options.getString('reason'),
    data = await schema.findOne({
        guild_id: guild.id,
        user_id: user.id
    });
    if(data) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setColor(colors.red)
                .setDescription(`${emojis.cross} | You are already set as AFK.`)
            ]
        })
    } else {
        new schema({
            guild_id: guild.id,
            user_id: user.id,
            reason: reason
        }).save().then(async () => {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(colors.green)
                    .setDescription(`${emojis.tick} | You have been set as AFK.`)
                ]
            })
        }).catch((err) => {
            console.log(chalk.red(`[CLIENT] - something went wrong an user as AFK.\n${err}`));
        });

    }
}