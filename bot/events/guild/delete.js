const { Events, EmbedBuilder } = require('discord.js');
const { colors, channels } = require('@config/config');
const schema = require('@schema/guild');
const chalk = require('chalk');

module.exports = {
    name: Events.GuildDelete,
    once: false,
    async execute(client, guild) {
        const data = await schema.findOne({
            guild_id: guild.id
        });
        if(data) {
            await data.delete().catch((err) => {
                console.log(chalk.red('[BOT] - could not delete old data from database in guild delete.'));
            });
        }
        const owner = await guild.fetchOwner().catch(err => {
            console.log(chalk.red('[BOT] - could not fetch owner in guild delete.\n' + err));
            return owner;
        });
        if(guild.available) {
            const info = {
                name: guild.name,
                id: guild.id,
                icon: guild.iconURL({size: 4096, dynamic: true}),
                banner: guild.bannerURL({size: 4096}),
                owner: owner.user,
                owner_id: owner.user.id,
                members: guild.memberCount.toString(),
                channels: guild.channels.cache.size.toString(),
                roles: guild.roles.cache.size.toString()
            }

            const log_channel = client.channels.cache.get(channels.log);

            const log = new EmbedBuilder()
            .setColor(colors.red)
            .setTitle('REMOVED FROM SERVER!')
            .setThumbnail(info.icon)
            .setImage(info.banner)
            .setDescription(`${client.user.username} was removed from a server.`)
             .addFields(
                 {name: 'NAME', value: info.name, inline: true},
                 {name: 'ID', value: info.id, inline: true},
                 {name: 'OWNER', value: info.owner.tag, inline: true},
                 {name: 'OWNER ID', value: info.owner_id},
                 {name: 'MEMBERS', value: info.members, inline: true},
                 {name: 'CHANNELS', value: info.channels, inline: true},
                 {name: 'ROLES', value: info.roles, inline: true},
                 )
                 .setTimestamp()
                
            if(log_channel) {
                try {
                    const webhooks = await log_channel.fetchWebhooks();
                    const webhook = webhooks.find(wh => wh.token);
                    if(webhook) {
                        webhook.send({
                            username: 'LEAVE LOG',
                            avatarURL: client.user.displayAvatarURL(),
                            embeds: [log],
                        });
                    } else {
                        log_channel.send({
                            embeds: [log]
                        });
                    }

                } catch (err) {
                    console.log(chalk.red(`[BOT] - couldn\'t log guild delete.`));
                } 
            }

        } else {
            return console.log(chalk.yellow('[BOT] - guild isn\'t available.'))
        }

    }
}