const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
    guild_id: String,
    panel_id: String,
    mod_role: String,
    panel_message: String,
    ticket_index: Number,
});

module.exports = model('ticket', ticketSchema, 'TicketData')