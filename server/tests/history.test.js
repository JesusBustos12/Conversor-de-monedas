require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

describe('History Integration Tests', () => {
    const testEmail = `history_test_${Date.now()}@example.com`;
    let token;
    let userId;

    beforeAll(async () => {
        const regRes = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'History Test',
                email: testEmail,
                pass: 'Pass12345'
            });
        userId = regRes.body.userId;

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: testEmail,
                pass: 'Pass12345'
            });
        token = loginRes.body.token;
    });

    afterAll(async () => {
        if (userId) {
            await db.execute('DELETE FROM conversions WHERE user_id = ?', [userId]);
            await db.execute('DELETE FROM login_logs WHERE user_id = ?', [userId]);
            await db.execute('DELETE FROM users WHERE id = ?', [userId]);
        }
    });

    describe('POST /api/history', () => {
        test('should save a conversion with valid data', async () => {
            const res = await request(app)
                .post('/api/history')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    from: 'USD',
                    to: 'EUR',
                    amount: 100,
                    result: '85.54',
                    rate: '1 USD = 0.8554 EUR'
                });
            
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toContain('guardada');
        });

        test('should fail with invalid currency code', async () => {
            const res = await request(app)
                .post('/api/history')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    from: 'INVALID',
                    to: 'EUR',
                    amount: 100,
                    result: '85.54',
                    rate: 'x'
                });
            
            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /api/history', () => {
        test('should retrieve user history', async () => {
            const res = await request(app)
                .get('/api/history')
                .set('Authorization', `Bearer ${token}`);
            
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });
});
