const { Schema, model } = require('mongoose');

const afkSchema = new Schema({
    guild_id: String,
    user_id: String,
    reason: String
});

module.exports = model('afk', afkSchema, 'AfkData')