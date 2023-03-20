const { EmbedBuilder } = require('discord.js'),
{ createProfile } = require('@utills/functions'),
{ colors, emojis } = require('@config/config'),  
        schema = require('@schema/profile'),
        chalk = require('chalk');

module.exports = {
	name: 'daily',
	description: 'collect your daily rewards.',
	type: 1,
	options: [],
	permissions: ['SendMessages'],
	async execute(client, interaction) {
		await interaction.deferReply({ ephemeral: true });

        const { guild, user } = interaction,
        data = await schema.find({
            guild_id: guild.id,
            user_id: user.id
        });

        if(!data || !data.length) {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(colors.yellow)
                            .setDescription(`${emojis.setting} | Seems like you haven\'t registered an account before. Trying to create a profile for you.`)
                        ]
                    }).then(async () => {
                        await createProfile(guild, user).then(async () => {
                            setTimeout(async () => {
                                await interaction.editReply({
                                    embeds: [
                                    new EmbedBuilder()
                                    .setColor(colors.green)
                                    .setDescription(`${emojis.setting} | Successfully created a profile for you.`)
                                    ]
                                });
                            }, 5000)
                        });
                    }).then(async () => {
                        setTimeout(async () => {
                            await interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                    .setColor(colors.green)
                                    .setDescription(`${emojis.tick} | You have successfully collected your \`25💲\` daily reward.`)
                                ]
                            });
                        }, 10000);
                    }).then(async () => {
                        await schema.updateOne(
                            {
                                guild_id: guild.id,
                                user_id: user.id
                            },
                            {
                                $inc: {
                                   'economy.wallet': 25
                                },
                                $set: {
                                    'economy.last_daily': Date.now()
                                }
                            },
                        )
                    }).catch((err) => {
                    console.log(chalk.red(`[CLIENT] - couldn\'t create profile in daily.js\n${err}`));
                });
            
        } else if(data || data.length) {
            if(!data[0].economy.last_daily) {
                await schema.updateOne(
                    {
                        guild_id: guild.id,
                        user_id: user.id
                    },
                    {
                        $inc: {
                           'economy.wallet': 25
                        },
                        $set: {
                            'economy.last_daily': Date.now()
                        }
                    },
                ).catch(console.error).then(async () => {
                    await interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(colors.green)
                            .setDescription(`${emojis.tick} | You have successfully collected your \`25 💲\` daily reward.`)
                        ]
                    });
                })
            } else if (Date.now() - data[0].economy.last_daily > 86400000) {
                await schema.updateOne(
                    {
                        guild_id: guild.id,
                        user_id: user.id
                    },
                    {
                        $inc: {
                           'economy.wallet': 25
                        },
                        $set: {
                            'economy.last_daily': Date.now()
                        }
                    },
                ).catch(console.error).then(async () => {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(colors.green)
                            .setDescription(`${emojis.tick} | You have successfully collected your \`25💲\` daily reward.`)
                        ]
                    });
                });
            } else {
                const lastDaily = new Date(data[0].economy.last_daily);
                const timeLeft = Math.round((lastDaily.getTime() + 86400000 - Date.now()) / 1000);
                const hours = Math.floor(timeLeft / 3600);
                const minutes = Math.floor((timeLeft - hours * 3600) / 60);
                const seconds = timeLeft - hours * 3600 - minutes * 60;

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(colors.red)
                        .setDescription(`${emojis.cross} | You\'ve already collected your daily reward.\nPlease come back again after \`${hours}h\` \`${minutes}m\` \`${seconds}s\``)
                    ]
                })
            }
        }
	},
};