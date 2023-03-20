const { AttachmentBuilder } = require('discord.js'),
{sendError} = require('@utills/functions'),
{channels} = require('@config/config'),
fetch = require('node-fetch'),
url = require('url'),
chalk = require('chalk');

module.exports = {
	name: 'snapshot',
	description: 'get a screen shot of any site.',
	type: 1,
	options: [
        {
            name: 'url',
            description: 'the url of the site you want a screenshot from.',
            type: 3,
            required: true
        }
    ],
	permissions: ['SendMessages'],
	async execute(client, interaction) {
		await interaction.deferReply();
        const { options } = interaction,
        url = options.getString('url'),
        site = /^(https?:\/\/)/i.test(url) ? url : `http://${url}`;
        
        try {
            const { body } = await fetch(`https://image.thum.io/get/width/1920/crop/675/noanimate/${site}`);
            const attachment = new AttachmentBuilder(body, { name: 'screenshot.png' });
            await interaction.editReply({
                content: `Here is a snap shot from ${url}`,
                files: [attachment]
            });
        } catch (error) {
            if(error.status === 404) {
                await interaction.editReply({
                    content: 'Seems like the url you provided was invalid or the site is unavailable.'
                });
            } else {
                await interaction.editReply({
                    content: 'Something went wrong. Please try again later.'
                });
                if(error.length > 2048) {
                    console.log(chalk(`[CLIENT] - an error occured while taking screenshot from ${url}\n${error}`));
                    sendError(`[CLIENT] - an error occured while taking screenshot from ${url}`, channels.log);
                } else {
                    sendError(`[CLIENT] - an error occured while taking screenshot from ${url}\n${error.toString()}`, channels.log).catch(console.log(chalk.red(`[CLIENT] - could not send error message`)));
                }
            }
        }
	},
};