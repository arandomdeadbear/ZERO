const { Schema, model } = require('mongoose');

const profileSchema = new Schema({
    guild_id: String,
    user_id: String,
    thanks: Number,
    warns: Number,
    economy: {
        wallet: Number,
        bank: Number,
        inventory: Array,
        jobs: Array,
        last_beg: Date,
        last_daily: Date,
        last_monthly: Date,
    },
    create_date: Date
});

module.exports = model('profile', profileSchema, 'Profiles')