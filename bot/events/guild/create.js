const { Events, EmbedBuilder } = require('discord.js');
const { colors, channels } = require('@config/config');
const schema = require('@schema/guild');
const chalk = require('chalk');

module.exports = {
    name: Events.GuildCreate,
    once: false,
    async execute(client, guild) {
        let data = await schema.findOne({
            guild_id: guild.id
        });
        if(data) {
            await data.delete().catch((err) => {
                console.log(chalk.red('[BOT] - could not delete old data from db in guild create.\n' + err));
            });
            data = new schema({
                guild_id: guild.id
            });
            await data.save().catch((err) => {
                console.log(chalk.red('[BOT] - could not save data to db in guild create.\n' + err));
            });
        } else {
            data = new schema({
                guild_id: guild.id
            });
            await data.save().catch((err) => {
                console.log(chalk.red('[BOT] - could not save data to db in guild create.\n' + err));
            });
        }
        if(guild.available) {
            const owner = await guild.fetchOwner().catch(err => {
                console.log(chalk.red('[BOT] - could not fetch owner in guild create.\n' + err));
                return owner;
            });
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
            .setColor(colors.green)
            .setTitle('NEW SERVER!')
            .setThumbnail(info.icon)
            .setImage(info.banner)
            .setDescription(`${client.user.username} was added to a new server.`)
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
                            username: 'JOIN LOG',
                            avatarURL: client.user.displayAvatarURL(),
                            embeds: [log],
                        });
                    } else {
                        log_channel.send({
                            embeds: [log]
                        });
                    }

                } catch (err) {
                    console.log(chalk.red(`[BOT] - couldn\'t log guild create.`));
                } 
            }

        } else {
            return console.log(chalk.yellow('[BOT] - guild isn\'t available.'))
        }

    }
}