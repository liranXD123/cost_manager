// services/logger.service.js
const pino = require('pino');
const Log = require('../models/log.model');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

function loggerMiddleware(req, res, next) {
    const start = Date.now();

    res.on('finish', async () => {
        const timeMs = Date.now() - start;

        // pino console log
        logger.info(
            {
                method: req.method,
                url: req.originalUrl,
                statusCode: res.statusCode,
                timeMs
            },
            'http_request'
        );

        // MongoDB log (required)
        try {
            await Log.create({
                method: req.method,
                url: req.originalUrl,
                time: new Date(),
                statusCode: res.statusCode,
                timeMs
            });
        } catch (e) {
            // don't crash the request if logging fails
            logger.error({ err: e }, 'failed_to_write_log');
        }
    });

    next();
}

module.exports = loggerMiddleware;
