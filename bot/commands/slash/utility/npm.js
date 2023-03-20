const { EmbedBuilder } = require('discord.js'),
{ colors, emojis } = require('@config/config'),  
fetch = require('node-fetch'),
moment = require('moment'),
chalk = require('chalk');


module.exports = {
	name: 'npm',
	description: 'search an npm package.',
	type: 1,
	options: [
        {
            name: 'name',
            description: 'name of the package.',
            type: 3,
            required: true
        }
    ],
	permissions: ['SendMessages'],
	async execute(client, interaction) {
		await interaction.deferReply();
        const { options } = interaction,
        name = options.getString('name'),
        pkg = encodeURIComponent(name);
        
        try {
            const response = await fetch(`https://registry.npmjs.com/${pkg}`);
            const body = await response.json();
            if (response.status === 404 || body.time.unpublished) {
                await interaction.editReply({
                    content: `${name} no longer exists.`
                });
            } else {
                const version = body.versions[body['dist-tags'].latest]
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(colors.red)
                        .setDescription(body.description + `\n\n❯ [*Home Page*](${body.homepage})   ❯ [*Repository*](${body.repository.url.substring(4)})` || 'No description was provided.')
                        .setURL(`https://www.npmjs.com/package/${pkg}`)
                        .setThumbnail('https://i.imgur.com/ErKf5Y0.png')
                        .setTitle(body.name.toUpperCase())
                        .addFields(
                            {name: 'Current Version', value: body['dist-tags'].latest, inline: true},
                            {name: 'License', value: body.license || 'None', inline: true},
                            {name: 'Author', value: body.author ? body.author.name : 'Not Provided', inline: true},
                            {name: 'Author Mail', value: body.author ? body.author.email : 'Not Provided', inline: true},
                            {name: 'Created At', value: moment.utc(body.time.created).format('MM/DD/YYYY h:mm A'), inline: true},
                            {name: 'Last Modified', value: moment.utc(body.time.modified).format('MM/DD/YYYY h:mm A'), inline: true}
                        )

                    ]
                })

            }
        } catch (err) {
          console.log(err)
        }
	},
};