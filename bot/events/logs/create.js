const { AuditLogEvent, Events } = require('discord.js'),
{colors, emojis, channels} = require('@config/config'),
{sendLog} = require('@utills/functions'),
chalk = require('chalk');

module.exports = {
    name: Events.GuildAuditLogEntryCreate,
    once: false,
    async execute(client, auditLog ) {
        const { targetType } = auditLog;
        console.log(targetType)
        if (targetType === 'Message') {
            const {action, executorId, target, targetId, extra} = auditLog;
            console.log(extra.channel.name)
            if(action == 72) {
               if(target) {
                const user = await client.users.fetch(executorId);
                sendLog('Message Deleted',
                colors.red,
                `A message by ${target} was deleted by ${user} in <#${extra.channel.id}>`,
                client.guilds.cache.get('1046085606742175754').channels.cache.get('1046087704749817906')
                )
               }
            }
        } else {
            return;
        }
    }
}