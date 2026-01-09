const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

const app = require('../app');
const Cost = require('../models/cost.model');
const Report = require('../models/report.model');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    await Cost.deleteMany({});
    await Report.deleteMany({});
});

describe('Reports endpoint', () => {
    test('GET /api/report should return grouped monthly report', async () => {
        // Put costs in specific month/year so report finds them
        // NOTE: We insert costs directly into MongoDB for testing.
        // The API itself blocks adding costs with past dates by requirement.
        await Cost.create([
            {
                description: 'choco',
                category: 'food',
                userid: 123123,
                sum: 12,
                createdAt: new Date('2025-11-17T10:00:00Z')
            },
            {
                description: 'math book',
                category: 'education',
                userid: 123123,
                sum: 82,
                createdAt: new Date('2025-11-10T10:00:00Z')
            }
        ]);

        const res = await request(app).get('/api/report?id=123123&year=2025&month=11');

        expect(res.statusCode).toBe(200);
        expect(res.body.userid).toBe(123123);
        expect(res.body.year).toBe(2025);
        expect(res.body.month).toBe(11);
        expect(Array.isArray(res.body.costs)).toBe(true);

        // basic shape checks (don’t overfit exact order too hard)
        const costsArr = res.body.costs;
        const foodObj = costsArr.find(o => Object.keys(o)[0] === 'food');
        expect(foodObj).toBeTruthy();
        expect(Array.isArray(foodObj.food)).toBe(true);
        expect(foodObj.food[0]).toHaveProperty('sum');
        expect(foodObj.food[0]).toHaveProperty('description');
        expect(foodObj.food[0]).toHaveProperty('day');
    });

    test('Computed pattern: second call should reuse saved report', async () => {
        await Cost.create({
            description: 'coffee',
            category: 'food',
            userid: 999,
            sum: 10,
            createdAt: new Date('2025-11-01T10:00:00Z')
        });

        // First call computes and saves
        const res1 = await request(app).get('/api/report?id=999&year=2025&month=11');
        expect(res1.statusCode).toBe(200);

        const saved = await Report.findOne({ userid: 999, year: 2025, month: 11 });
        expect(saved).toBeTruthy();

        // Add a new cost AFTER first report was computed
        // (If computed caching exists, second call returns the old saved report)
        await Cost.create({
            description: 'late snack',
            category: 'food',
            userid: 999,
            sum: 5,
            createdAt: new Date('2025-11-02T10:00:00Z')
        });

        const res2 = await request(app).get('/api/report?id=999&year=2025&month=11');
        expect(res2.statusCode).toBe(200);

        // The report should match the cached one (same _id)
        expect(res2.body._id).toBe(String(saved._id));
    });
});
