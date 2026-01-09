// processes/usersProcess.js
const express = require('express');
const { connectMongo } = require('../db/mongo');
const loggerMiddleware = require('../services/logger.service');

async function start() {
    await connectMongo();

    const app = express();
    app.use(express.json());
    app.use(loggerMiddleware);

    // ONLY users logic
    app.use('/api', require('../routes/users.routes'));

    const port = Number(process.env.USERS_PORT || 3001);
    app.listen(port, '0.0.0.0', () => {
        console.log('Users process listening on', port);
    });
}

start().catch(err => {
    console.error(err);
    process.exit(1);
});
