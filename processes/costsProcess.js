// processes/costsProcess.js
const express = require('express');
const { connectMongo } = require('../db/mongo');
const loggerMiddleware = require('../services/logger.service');

async function start() {
    await connectMongo();

    const app = express();
    app.use(express.json());
    app.use(loggerMiddleware);

    // ONLY costs + reports logic
    app.use('/api', require('../routes/costs.routes'));
    app.use('/api', require('../routes/reports.routes'));

    const port = Number(process.env.COSTS_PORT || 3002);
    app.listen(port, '0.0.0.0', () => {
        console.log('Costs process listening on', port);
    });
}

start().catch(err => {
    console.error(err);
    process.exit(1);
});
