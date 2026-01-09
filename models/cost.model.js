const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const { Double } = mongoose.Schema.Types;

const CostSchema = new mongoose.Schema({
    description: { type: String, required: true },
    category: { type: String, enum: ['food', 'health', 'housing', 'sports', 'education'], required: true },
    userid: { type: Number, required: true },
    sum: { type: Double, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cost', CostSchema);
