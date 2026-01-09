// processes/logsProcess.js
const express = require('express');
const { connectMongo } = require('../db/mongo');
const loggerMiddleware = require('../services/logger.service');

async function start() {
    await connectMongo();

    const app = express();
    app.use(express.json());
    app.use(loggerMiddleware);

    // Mount ONLY logs routes in this process
    app.use('/api', require('../routes/logs.routes'));

    const port = Number(process.env.LOGS_PORT || 3004);
    app.listen(port, '0.0.0.0', () => {
        console.log('Logs process listening on', port);
    });
}

start().catch(err => {
    console.error(err);
    process.exit(1);
});
