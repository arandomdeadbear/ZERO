const { Schema, model } = require('mongoose');

const tagSchema = new Schema({
    guild_id: String,
    owner_id: String,
    name: String,
    description: String,
    content: String
});

module.exports = model('tags', tagSchema, 'TagData')