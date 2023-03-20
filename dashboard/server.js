const express = require('express');
const chalk = require('chalk');
const path = require('path');
const port = process.env.PORT || 8080;
const { settings } = require('@config/config');

if(settings.dashboard) {
    console.log(chalk.green('[DASHBOARD] - dashboard is enabled, launching dashboard...'));
    const app = express();
    app.enable('trust proxy');
    app.set('etag', false);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, './views'));
    ['routes'].forEach((file) => {
        require(`@handler/dashboard/${file}`)(app);
    });
    app.use(express.static(path.join(__dirname, 'public')))
    const http = require("http").createServer(app);
    http.listen(port, () => {
        console.log(chalk.green('[DASHBOARD] - dashboard is listening to port ' + port));
    });

} else {
    console.log(chalk.green('[DASHBOARD] - dashboard is disabled.'));
}