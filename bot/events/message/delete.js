const { Events, ChannelType, AttachmentBuilder, AuditLogEvent, EmbedBuilder } = require('discord.js'),
{emojis, colors} = require('@config/config'),
loggerSchema = require('@schema/logger'), 
moment = require('moment'),
chalk = require('chalk');

module.exports = {
  name: Events.MessageDelete,
  once: false,
  async execute(client, message) {
    if (!message.guild || message.system ) return;

    const data = await loggerSchema.findOne({
      guild_id: message.guild.id
  });
  if(data) {
      const logChannel = message.guild.channels.cache.get(data.channel_id),
      fetchedLogs = await message.guild.fetchAuditLogs({
          type: AuditLogEvent.MessageDelete,
          limit: 1,
      }),
      auditLog = fetchedLogs.entries.first();
      const sampleUser = {
        id: 'xxxxxxxxxxxxx',
        bot: 'unknown',
        system: 'unknown',
        username: 'USER',
        discriminator: '0000',
        tag: 'USER#0000'
      },
      noImage = 'https://media.discordapp.net/attachments/1046087704749817906/1086428256342908928/no_image.png'
      let content = message.content;
      if (content === '' || content == null) content = 'null';
          const user = await message.guild.members.cache.get(auditLog?.executorId).user || sampleUser,
          author = message?.author || auditLog?.target || sampleUser,
          channel = message.channel ?? auditLog?.extra.channel, 
          loggerEmbed = new EmbedBuilder()
          .setColor(colors.red)
          .setTitle('MESSAGE DELETED')
          .setDescription(`**Content**\n${content}`)
          .addFields(
            {name: 'Author', value:`<@${author.id}>`, inline: true},
            {name: 'Deleted By', value:`<@${user.id}>`, inline: true},
            {name: 'Channel', value:`<#${channel.id}>`, inline: true},
            {name: '\u200B', value: '**Attachment**', inline: false}
          )
          .setImage(message.attachments.first()
          ? message.attachments.first().proxyURL
          : noImage);

          try {
            const webhooks = await logChannel.fetchWebhooks().catch(console.error);
      const webhook = webhooks.find((wh) => wh.token);
      if(!webhook) {
        try {
          logChannel.createWebhook({
              name: client.user.username + ' LOGGER',
              avatar: client.user.displayAvatarURL()
            }).then(async (hook) => {
              await hook.send({
                username: client.user.username,
                avatarURL: client.user.displayAvatarURL(),
                embeds: [loggerEmbed]
              })
            }).catch(console.error);
          } catch (err) {
            logChannel.send({
              embeds: [loggerEmbed]
            })
          }
      } else {
        await webhook.send({
          username: `${client.user.username}`,
          avatarURL: client.user.displayAvatarURL(),
          embeds: [loggerEmbed]     
        }).catch(console.error);
      }
          } catch (err) {
            logChannel.send({
              embeds: [loggerEmbed]
            });
          }
  }
    try {
      const { channel, type, author, attachments, createdAt } = message;

      const user = message.member.user ?? author;
      const noImage = 'https://media.discordapp.net/attachments/1046087704749817906/1086428256342908928/no_image.png'

      client.snipes.set(channel.id, {
        author: {
          tag: user.tag,
          discriminator: user.discriminator,
          id: user.id,
          type: user.bot ? 'BOT' : 'USER',
          dp: message.member.user.displayAvatarURL({
            dynamic: true,
            size: 2048
          })
        },
        msg: {
          id: message.id,
          content: content,
          channel: channel,
          type: type,
          image: attachments.first()
            ? attachments.first().proxyURL
            : noImage,
          time: moment(createdAt).format('llll'),
          channel: channel.id,
          ch_type: channel.type
        }
      });

      console.log(client.snipes.get(message.channel))
    } catch (err) {
      return;
    }
  }
};