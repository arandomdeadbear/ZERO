const client = require('@bot/bot');

module.exports = {
    name: '/',
    async execute(req, res) {
        const args = {
            req: req,
            bot: client,
            user: req.user
        }
        res.render('home', args);
    }
}