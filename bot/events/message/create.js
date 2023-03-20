const { Events, EmbedBuilder } = require('discord.js'),
chalk = require('chalk'),
chatBotSchema = require('@schema/chatbot'),
afkSchema = require('@schema/afk'),
{ settings, secrets, colors, emojis } = require('@config/config'),
{ Configuration, OpenAIApi } = require('openai'),
configuration = new Configuration({
	apiKey: process.env.OPEN_AI_TOKEN,
  }),
openai = new OpenAIApi(configuration);

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(client, message) {
		const { channel, guild, author, content } = message,
		prefix = settings.prefix,
		data = await chatBotSchema.findOne({
			guild_id: message.guild.id
		}),
		afkData = await afkSchema.findOne({
			guild_id: guild.id
		});
		if(afkData) {
			if(message.author.id !== afkData.user_id) {
				if(message.author.bot) return;
				const mention = message.mentions.members.first()
				if(mention) {
					if(mention.user.id == afkData.user_id) {
						const mem = guild.members.cache.get(afkData.user_id);
						message.reply({
							embeds: [
								new EmbedBuilder()
								.setColor(colors.red)
								.setTitle(`${mem.user.username.toUpperCase()} IS AFK.`)
								.setDescription(`${emojis.cross} | The person you just mentioned is currently AFK [Away From Keyboard.]\n\n**REASON:** \`\`\`${afkData.reason}\`\`\``)
							],
							allowedMentions: {
								repliedUser: true
							}
						}).then((msg) => {
							setTimeout(() => {
								msg.delete()
							}, 5000)
						})
					}
				}
			}
		}
		if(author.bot || author.system || message.system ) return;
		if(data && channel.id === data.channel_id ) {
			if(content.startsWith('!')) return;
				try {
					await channel.sendTyping();
				if (content.length > 2000) {
					message.reply("Sorry, I can't really go through all that. Please summerise your query and try again.");
					return;
				  }
		
				  let prevMessages = await channel.messages.fetch({ limit: 75 });
				  prevMessages = prevMessages.sort((a, b) => a - b);
		
				  let conversationLog = [
					{ role: 'system', content: 'You are a chatbot in Discord that reluctantly answers questions with sarcastic responses.' }
				  ];
		
				  prevMessages.forEach((msg) => {
					if (msg.content.startsWith('!')) return;
					if (msg.content.length > 2000) return;
					if (msg.author.id !== client.user.id && message.author.bot) return;
					if (msg.author.id !== author.id) return;
			  
					conversationLog.push({
					  role: 'user',
					  content: `${msg.content}`,
					});
				  });
		
				  const compli = await openai.createChatCompletion({
					model: 'gpt-3.5-turbo',
					messages: conversationLog,
				  }),
				  result = compli.data.choices[0];
				  if(result.message.content.length > 2000) {
					const txt = result.message.content
					const chunks = txt.match(/.{1,2000}/g);
					for (const [index, chunk] of chunks.entries()) {
						setTimeout(() => {
							message.channel.send(chunk.toString());
						}, index * 3000);
					}
				  } else if(result.finish_reason === 'length') {
					message.reply(result.message + '...')
				  } else {
					message.reply(result.message)
				  }
				} catch (err) {
					message.reply({
						content: 'ChatBot is currently under maintenence. Please try again later.'
					  })
					  console.log(err)
				}
		} else {
			if(!content.toLowerCase().startsWith(prefix) || !secrets.devs.includes(author.id)) return;

			const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
			if(cmd.length === 0) return;
	
			const command = client.commands.get(cmd.toLowerCase()) || client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));
			if(!command) return;
			
			try {
		  		command.execute(client, message, args);
			} catch (err) {
		  console.log(chalk.red(`[BOT] - something went wrong executing message command.\n${err}`));
			}
		}
	}
}