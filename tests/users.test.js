const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

const app = require('../app');
const User = require('../models/user.model');

beforeAll(async () => {
    // Use a different DB for tests if you want (recommended):
    // put MONGO_URI_TEST in .env and use it here.
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    await User.deleteMany({});
});

describe('Users endpoints', () => {
    test('POST /api/add should add a user', async () => {
        const res = await request(app).post('/api/add').send({
            id: 123123,
            first_name: 'mosh',
            last_name: 'israeli',
            birthday: '2000-01-01'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(123123);
        expect(res.body.first_name).toBe('mosh');
        expect(res.body.last_name).toBe('israeli');
    });

    test('GET /api/users should return list of users', async () => {
        await User.create({
            id: 111,
            first_name: 'a',
            last_name: 'b',
            birthday: new Date('2001-01-01')
        });

        const res = await request(app).get('/api/users');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].id).toBe(111);
    });

    test('POST /api/add should return error JSON on invalid body', async () => {
        // Missing required "id"
        const res = await request(app).post('/api/add').send({
            first_name: 'x',
            last_name: 'y',
            birthday: '2000-01-01'
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('message');
    });
});
//testing users addition