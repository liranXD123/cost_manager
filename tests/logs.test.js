const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

const app = require('../app');
const Log = require('../models/log.model');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    await Log.deleteMany({});
});

describe('Logs endpoint', () => {
    test('GET /api/logs returns logs list', async () => {
        // Trigger at least one request so logger middleware writes a log
        await request(app).get('/api/logs');

        const res = await request(app).get('/api/logs');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        // Should have at least 1 log entry
        expect(res.body.length).toBeGreaterThan(0);

        // Check log structure
        expect(res.body[0]).toHaveProperty('method');
        expect(res.body[0]).toHaveProperty('url');
        expect(res.body[0]).toHaveProperty('time');
    });

    test('Logger writes a log for another endpoint too', async () => {
        await request(app).get('/api/about'); // should log

        const logs = await Log.find();
        expect(logs.length).toBeGreaterThan(0);
        expect(logs[0].url).toBeTruthy();
    });
});
//testing logs