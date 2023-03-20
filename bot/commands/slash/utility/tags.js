const { EmbedBuilder } = require('discord.js'),
      { colors, emojis } = require('@config/config'),  
        schema = require('@schema/tags'),
        chalk = require('chalk');

module.exports = {
	name: 'tag',
	description: 'create, delete, edit or execute tags.',
	type: 1,
	options: [
        {
            name: 'execute',
            description: 'Execute a tag.',
            type: 1,
            options: [
                {
                    name: 'name',
                    description: 'name of the tag which you want to execute.',
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: 'create',
            description: 'create a new tag.',
            type: 1,
            options: [
                {
                    name: 'name',
                    description: 'name of the tag.',
                    type: 3,
                    required: true
                },
                {
                    name: 'description',
                    description: 'write a short description for the tag.',
                    type: 3,
                    max_length: 120,
                    required: true
                },
                {
                    name: 'content',
                    description: 'Content of the tag.',
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: 'edit',
            description: 'edit an existing tag.',
            type: 1,
            options: [
                {
                    name: 'name',
                    description: 'name of the tag.',
                    type: 3,
                    required: true
                },
                {
                    name: 'description',
                    description: 'write a short description for the tag.',
                    type: 3,
                    max_length: 120,
                    required: true
                },
                {
                    name: 'content',
                    description: 'content of the tag.',
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: 'delete',
            description: 'Delete a tag.',
            type: 1,
            options: [
                {
                    name: 'name',
                    description: 'the name of the tag which you want to delete.',
                    type: 3,
                    required: true
                }
            ]
        }
    ],
	permissions: ['SendMessages'],
	async execute(client, interaction) {
        await interaction.deferReply();
        const { guild, user, member } = interaction;
        //execute tag
        if(interaction.options.getSubcommand() === 'execute') {
           const name = interaction.options.getString('name'),
                 data = await schema.findOne({
                    guild_id: guild.id,
                    name: name
                 });

                 if(data) {
                    interaction.editReply({
                        content: data.content
                    });
                 } else {
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(colors.red)
                            .setDescription(`${emojis.cross} | Couldn\'t find any tag saved with the name you provided. Run \`/tag list\` to view all the available tags. If you want to create a new tag with the name, please run \`/tag create\`.`)
                        ]
                    });
                    return;
                 }
        } else if(interaction.options.getSubcommand() === 'create') {
            const name = interaction.options.getString('name'),
                  description = interaction.options.getString('description'),
                  content = interaction.options.getString('content'),
                  data = await schema.findOne({
                         guild_id: guild.id,
                         name: name
                     });

            if(data) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(colors.red)
                        .setDescription(`${emojis.cross} | The tag already exist with the name you provided. Please try again with a different name.`)
                    ]
                });
                return;
            } else {
                await new schema({
                    guild_id: guild.id,
                    owner_id: user.id,
                    name: name,
                    description: description,
                    content: content
                }).save().then(async () => {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(colors.green)
                            .setDescription(`${emojis.tick} | Tag has been created successfully and data has been saved.`)
                        ]
                    });
                }).catch(err => {
                    console.log(chalk.red(`[CLIENT] - could not create new tag.\n${err}`))
                });
            }
        } else if(interaction.options.getSubcommand() === 'edit') {
            const name = interaction.options.getString('name'),
                  data = await schema.findOne({
                    guild_id: guild.id,
                    name: name
                  });
            if(data) {
                if(user.id === data.owner_id) {
                    const description = interaction.options.getString('description'),
                          content = interaction.options.getString('content');
                    await data.delete().then(async () => {
                        await new schema({
                            guild_id: guild.id,
                            owner_id: user.id,
                            name: name,
                            description: description,
                            content: content
                        }).save().then(async () => {
                            await interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                    .setColor(colors.green)
                                    .setDescription(`${emojis.setting} | Tag has been edited and new data has been saved successfully.`)
                                ]
                            });
                        }).catch(console.error);
                    }).catch(err => {
                        console.log(chalk.red(`[CLIENT] - could not delete existing tag data when editing.\n${err}`));
                    });

                } else {
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(colors.red)
                            .setDescription(`${emojis.cross} | You are not the owner of this tag. Only owners can edit the tags.`)
                        ]
                    });
                }
            } else {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(colors.red)
                        .setDescription(`${emojis.cross} | Couldn\'t fine any tag saved with the name you provided.`)
                    ]
                });
                return;
            }
        } else if(interaction.options.getSubcommand() === 'delete') {
            const name = interaction.options.getString('name'),
                  data = await schema.findOne({
                    guild_id: guild.id,
                    name: name
                  });

            if(data) {
                if(data.owner_id === user.id) {
                    await data.delete().then(async () => {
                        await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                .setColor(colors.green)
                                .setDescription(`${emojis.tick} | Successfully deleted the tag.`)
                            ]
                        });
                    }).catch((err) => {
                        console.log(chalk.red(`[CLIENT] - couldn\'t delete tag data.\n` + err));
                    });
                } else {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(colors.red)
                            .setDescription(`${emojis.cross} | You\'re not the owner of the command nor a moderator of this server. You can\'t perform this task.`)
                        ]
                    })
                }
            } else {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(colors.red)
                        .setDescription(`${emojis.cross} | Couldn\'t find any tag with the name you provided.`)
                    ]
                });
            }
        }
    },
};