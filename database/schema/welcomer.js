const { Schema, model } = require('mongoose');

const welcomeSchema = new Schema({
    guild_id: String,
    channel_id: String,
    image_url: String
});

module.exports = model('welcomer', welcomeSchema, 'WelcomerData')