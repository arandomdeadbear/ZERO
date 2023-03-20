const { EmbedBuilder } = require('discord.js'),
{ createProfile } = require('@utills/functions'),
{ colors, emojis } = require('@config/config'),  
        schema = require('@schema/profile'),
        chalk = require('chalk');

module.exports = {
	name: 'balance',
	description: 'check user\'s balance',
	type: 1,
	options: [
        {
            name: 'target',
            description: 'the user to show balance of',
            type: 6,
            required: false
        }
    ],
	permissions: ['SendMessages'],
	async execute(client, interaction) {

    await interaction.deferReply({ ephemeral: true });

	const { guild, user, options } = interaction,
    target = options.getUser('target') ?? user,
    data = await schema.find({
        guild_id: guild.id,
        user_id: target.id
    });

    if(!data.length) {
        if(target !== user) {
             interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setColor(colors.red)
                    .setDescription(`${emojis.cross} | Seems like ${target.username} doesn\'t have a profile created yet.`)
                ]
             });
             return;
        } else {
                await interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(colors.yellow)
                        .setDescription(`${emojis.setting} | Seems like you haven\'t registered an account before. Trying to create a profile for you.`)
                    ]
                }).then(async () => {
                    await createProfile(guild, user).then(async () => {
                        await interaction.editReply({
                            embeds: [
                            new EmbedBuilder()
                            .setColor(colors.green)
                            .setDescription(`${emojis.tick} | Successfully created a profile for you. Your current balance is - `)
                            .addFields(
                                {name: 'Wallet', value: `\`\`\`\n0 💲\n\`\`\``, inline: true},
                                {name: 'Bank', value: `\`\`\`\n0 💲\n\`\`\``, inline: true},
                                {name: 'Total', value: `\`\`\`\n0 💲\n\`\`\``, inline: true},
                            )
                            ]
                        })
                    })
                }).catch((err) => {
                console.log(chalk.red(`[CLIENT] - couldn\'t create profile in balance.js\n${err}`));
            });
        }
    } else {
        let wallet = data[0].economy.wallet;
        if(isNaN(wallet)) wallet = 0;
        let bank = data[0].economy.bank;
        if(isNaN(bank)) bank = 0;
        let total= wallet + bank;
        if(isNaN(total)) total = 0;
        
        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setColor(colors.green)
                .addFields(
                    {name: 'Wallet', value: `\`\`\`\n${wallet} 💲\n\`\`\``, inline: true},
                    {name: 'Bank', value: `\`\`\`\n${bank} 💲\n\`\`\``, inline: true},
                    {name: 'Total', value: `\`\`\`\n${total} 💲\n\`\`\``, inline: true},
                )
            ]
        })
    }
	},
};