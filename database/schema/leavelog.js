const { Schema, model } = require('mongoose');

const leaveLogSchema = new Schema({
    guild_id: String,
    channel_id: String,
    image_url: String
});

module.exports = model('leavelog', leaveLogSchema, 'LeaveLogs');