const { EmbedBuilder } = require('discord.js'),
{colors, emojis} = require('@config/config'),
Profile = require('@schema/profile'),
client = require('@bot/bot');

module.exports = {
    createProfile: async function createProfile(guild, user) {
        const profile = await Profile.find({ guild_id: guild.id, user_id: user.id });
        if (!profile.length) {
          await new Profile({
            guild_id: guild.id,
            user_id: user.id,
            thanks: 0,
            warns: 0,
            economy: {
              wallet: 0,
              bank: 0,
              inventory: [],
              jobs: [],
            },
            create_date: new Date()
          }).save();
          return true;
        }
        return false;
      },
    subcommand: async function subcommand(client, interaction) {
      try {
        return require(`${process.cwd()}/bot/commands/subslashes/${interaction.commandName}/${interaction.options.getSubcommand()}`)(client, interaction).catch(err => {
          client.emit("errorCreate", err, interaction.commandName, interaction)
      })
      } catch{
        return require(`${process.cwd()}/bot/commands/subslashes/${interaction.commandName}/${interaction.options.getSubcommand()}`)(client, interaction).catch(err => {
          client.emit("errorCreate", err, interaction.commandName, interaction)
      })
      }
    },
    sendError: async function sendError(text, channelId) {
      const channel = client.guilds.cache.get('1046085606742175754').channels.cache.get(channelId);
      channel.send({
        embeds: [
          new EmbedBuilder()
          .setColor(colors.red)
          .setTitlea('ERROR')
          .setDescription(`${emojis.cross} | ${text}`)
        ]
      })
    },
    sendLog: async function sendLog(title, color, text, channel) {
      channel.send({
        embeds: [
          new EmbedBuilder()
          .setColor(color)
          .setTitle(title.toUpperCase())
          .setDescription(`${emojis.staff} | ${text}`)
        ]
      })
    }
}
