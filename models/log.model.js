const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    method: String,
    url: String,
    time: Date,
    statusCode: Number,
    timeMs: Number
});

module.exports = mongoose.model('Log', LogSchema);
