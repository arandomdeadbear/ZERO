const { Schema, model } = require('mongoose');
const { settings } = require('@config/config');

const guildSchema = new Schema({
    guild_id: String,
    feature: {
        message_cmd: { type: Boolean, default: false },
        premium: { type: Boolean, default: false }
    },
    data: {
        prefix: { type: String, default: settings.prefix },
        owner_id: String
    }
});

module.exports = model('guild', guildSchema, 'Guilds')