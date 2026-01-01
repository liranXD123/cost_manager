const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    method: String,
    url: String,
    time: Date
});

module.exports = mongoose.model('Log', LogSchema);
