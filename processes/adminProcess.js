// processes/adminProcess.js
const express = require('express');
const { connectMongo } = require('../db/mongo');
const loggerMiddleware = require('../services/logger.service');

async function start() {
    await connectMongo();

    const app = express();
    app.use(express.json());
    app.use(loggerMiddleware);

    // Mount ONLY admin routes in this process
    app.use('/api', require('../routes/admin.routes'));

    const port = Number(process.env.ADMIN_PORT || 3003);
    app.listen(port, '0.0.0.0', () => {
        console.log('Admin process listening on', port);
    });
}

start().catch(err => {
    console.error(err);
    process.exit(1);
});
