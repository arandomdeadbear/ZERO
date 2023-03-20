const { EmbedBuilder } = require('discord.js'),
{colors, emojis} = require('@config/config');

module.exports = {
    data: {
        name: 'global',
    },
    async execute(client, interaction) {
        const {stats} = client;
        if(interaction.user.id === stats.owner) {
            const selected = interaction.values[0],
            statsEmbed = new EmbedBuilder()
            .setColor(colors.green)
            .setTitle(`${client.stats.name}'s ${selected} stats.`)
            if(!selected) return;
            if(selected === 'solo') {
                await interaction.update({
                    embeds: [
                        statsEmbed
                        .setThumbnail('https://media.discordapp.net/attachments/1067984803573547068/1086253914518720613/solo.jpg?width=936&height=468')
                        .addFields(
                            {name: 'KD', value: stats.solo.kd.toString(), inline: true},
                            {name: 'Kills', value: stats.solo.kills.toString(), inline: true},
                            {name: 'Match Played', value: stats.solo.matchesplayed.toString(), inline: true},
                            {name: 'Win Rate', value: stats.solo.winrate.toString(), inline: true},
                            {name: 'Top 10', value: stats.solo.placetop10.toString(), inline: true},
                            {name: 'Total Wins', value: stats.solo.placetop1.toString(), inline: true},
                            {name: 'Score', value: stats.solo.score.toString(), inline: true},
                        )
                    ],
                    components: []
                })
            } else if(selected === 'duo') {
                await interaction.update({
                    embeds: [
                        statsEmbed
                        .setThumbnail('https://media.discordapp.net/attachments/1067984803573547068/1086256235831107624/duo.jpg?width=936&height=468')
                        .addFields(
                            {name: 'KD', value: stats.duo.kd.toString(), inline: true},
                            {name: 'Kills', value: stats.duo.kills.toString(), inline: true},
                            {name: 'Match Played', value: stats.duo.matchesplayed.toString(), inline: true},
                            {name: 'Win Rate', value: stats.duo.winrate.toString(), inline: true},
                            {name: 'Top 10', value: stats.duo.placetop10.toString(), inline: true},
                            {name: 'Total Wins', value: stats.duo.placetop1.toString(), inline: true},
                            {name: 'Score', value: stats.duo.score.toString(), inline: true},
                        )
                    ],
                    components: []
                })
            } else if(selected === 'trio') {
                await interaction.update({
                    embeds: [
                        statsEmbed
                        .setThumbnail('https://media.discordapp.net/attachments/1067984803573547068/1086256235415875615/trio.jpg?width=936&height=468')
                        .addFields(
                            {name: 'KD', value: stats.trio.kd.toString(), inline: true},
                            {name: 'Kills', value: stats.trio.kills.toString(), inline: true},
                            {name: 'Match Played', value: stats.trio.matchesplayed.toString(), inline: true},
                            {name: 'Win Rate', value: stats.trio.winrate.toString(), inline: true},
                            {name: 'Top 10', value: stats.trio.placetop10.toString(), inline: true},
                            {name: 'Total Wins', value: stats.trio.placetop1.toString(), inline: true},
                            {name: 'Score', value: stats.trio.score.toString(), inline: true},
                        )
                    ],
                    components: []
                })
            } else if (selected === 'squad') {
                await interaction.update({
                    embeds: [
                        statsEmbed
                        .setThumbnail('https://media.discordapp.net/attachments/1067984803573547068/1086253914728439859/squad.jpg?width=936&height=468')
                        .addFields(
                            {name: 'KD', value: stats.squad.kd.toString(), inline: true},
                            {name: 'Kills', value: stats.squad.kills.toString(), inline: true},
                            {name: 'Match Played', value: stats.squad.matchesplayed.toString(), inline: true},
                            {name: 'Win Rate', value: stats.squad.winrate.toString(), inline: true},
                            {name: 'Top 10', value: stats.squad.placetop10.toString(), inline: true},
                            {name: 'Total Wins', value: stats.squad.placetop1.toString(), inline: true},
                            {name: 'Score', value: stats.squad.score.toString(), inline: true},
                        )
                    ],
                    components: []
                })
            }
        } else {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(colors.red)
                    .setDescription(`${emojis.cross} | You are not allowed to perform this action.`)
                ],
                ephemeral: true
            })
        }
    }
}