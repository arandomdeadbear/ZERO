const { Schema, model } = require('mongoose');

const logSchema = new Schema({
    guild_id: String,
    channel_id: String,
});

module.exports = model('logger', logSchema, 'LogData')