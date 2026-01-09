// db/mongo.js
require('dotenv').config();
const mongoose = require('mongoose');

async function connectMongo() {
    if (!process.env.MONGO_URI) {
        throw new Error('Missing MONGO_URI in .env');
    }
    await mongoose.connect(process.env.MONGO_URI);
}

module.exports = { connectMongo };
