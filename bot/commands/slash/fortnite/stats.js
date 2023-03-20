const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js'),
{colors, emojis} = require('@config/config'),
fetch = require('node-fetch'),
chalk = require('chalk');

module.exports = {
	name: 'stats',
	description: 'get fortnite stats of a player.',
	type: 1,
	options: [
        {
            name: 'player',
            description: 'name of the player you want to get stats of.',
            type: 3,
            required: true
        }
    ],
	permissions: ['SendMessages'],
	async execute(client, interaction) {
		await interaction.deferReply();
        const player = encodeURIComponent(interaction.options.getString('player'));

        try {
            const response = await fetch(`https://fortniteapi.io/v1/lookup?username=${player}`, {
                headers: {
                    'Authorization': `${process.env.FNPIO}`
                  }
            }).catch(console.error),
            body = await response.json();
            if(!body || body.result == false) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                    .setColor(colors.red)
                    .setDescription(`${emojis.cross} | Could not find any data for player \`${player}\``)
                    ]
                })
            } else {
                const playerId = body.account_id;
                const playerData = await fetch(`https://fortniteapi.io/v1/stats?account=${playerId}`, {
                    headers: {
                        'Authorization': `${process.env.FNPIO}`
                      }
                }).catch(console.error),
                data = await playerData.json();
                if(data.result == false || data.code === 'PRIVATE_ACCOUNT') return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                    .setColor(colors.red)
                    .setDescription(`${emojis.cross} | This account is private and data can not be fetched.`)
                    ]
                });
                
                client.stats = {
                    name: data.name,
                    level: data.account.level,
                    season: data.account.season,
                    solo: data.global_stats.solo,
                    duo: data.global_stats.duo,
                    trio: data.global_stats.trio,
                    squad: data.global_stats.squad,
                    seasons: data.seasons_available,
                    owner: interaction.user.id
                }


                const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                    .setCustomId('global')
                    .setPlaceholder('Individual Stats')
                    .addOptions(
                        {
                            label: 'Solo',
                            description: `view solo stats of ${player}`,
                            value: 'solo',
                        },
                        {
                            label: 'Duo',
                            description: `view duo stats of ${player}`,
                            value: 'duo',
                        },
                        {
                            label: 'Trio',
                            description: `view trio stats of ${player}`,
                            value: 'trio',
                        },
                        {
                            label: 'Squad',
                            description: `view squad stats of ${player}`,
                            value: 'squad',
                        }
                    )
                )

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(colors.green)
                        .setTitle(data.name.toString() + '\'S Stats')
                        .setThumbnail('https://cdn.discordapp.com/attachments/1046087504471797830/1086039773996654733/fortnite_fggt.jpg')
                        .addFields(
                            {name: 'Battle Pass', value: 'LEVEL ' + data.account.level.toString(), inline: true },
                            {name: 'Avarage KD', value:Math.round((data.global_stats.solo.kd + data.global_stats.duo.kd + data.global_stats.squad.kd + data.global_stats.trio.kd)/4).toString(), inline: true},
                            {name: 'Total Kills', value:(data.global_stats.solo.kills + data.global_stats.duo.kills + data.global_stats.squad.kills + data.global_stats.trio.kills).toString(), inline: true},
                            {name: 'Total Win', value: (data.global_stats.solo.placetop1 + data.global_stats.duo.placetop1 + data.global_stats.squad.placetop1 + data.global_stats.trio.placetop1).toString(), inline: true },

                        )
                    ],
                    components: [row]
                }).catch(console.error)
            }
        } catch (err) {
            console.error(err)
        }


	},
};