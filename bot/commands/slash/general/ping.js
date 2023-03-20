module.exports = {
	name: 'ping',
	description: 'Replies with pong.',
	type: 1,
	options: [],
	permissions: ['SendMessages'],
	async execute(client, interaction) {
		await interaction.deferReply();
		await interaction.editReply({
			content: 'pong!',
			allowed_mentions: {
				replied_user: false
			}
		}).then(async (ee) => {
			setTimeout(async () => {
				await ee.edit({
					content: 'lmaooooo'
				})
			}, 5000)
		})
	},
};