const Log = require('../models/log.model');

module.exports = async (req, res, next) => {
    try {
        await Log.create({
            method: req.method,
            url: req.originalUrl,
            time: new Date()
        });
    } catch (err) {
        console.error('Logging failed:', err.message);
        // IMPORTANT: do NOT crash the server because of logs
    }
    next();
};
