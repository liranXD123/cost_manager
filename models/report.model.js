const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    userid: Number,
    year: Number,
    month: Number,
    costs: Array
});

module.exports = mongoose.model('Report', ReportSchema);
