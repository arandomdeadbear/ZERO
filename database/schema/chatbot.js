const { Schema, model } = require('mongoose');

const chatbotSchema = new Schema({
    guild_id: String,
    channel_id: String,
});

module.exports = model('chatbot', chatbotSchema, 'ChatBot')