const request = require('supertest');
const app = require('../app');

test('add cost', async () => {
    const res = await request(app).post('/api/add').send({
        description: 'coffee',
        category: 'food',
        userid: 123123,
        sum: 10
    });
    expect(res.statusCode).toBe(200);
});
