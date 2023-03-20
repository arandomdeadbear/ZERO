module.exports = {
	name: 'ping',
	async execute(client, message, args) {
		message.reply({
			content: 'PONG!',
            allowedMentions: {
                repliedUser: false
            }
		});
	}
}