require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

describe('User Integration Tests', () => {
    const testEmail = `user_test_${Date.now()}@example.com`;
    const testPassword = 'StrongPass123';
    let token;
    let userId;

    beforeAll(async () => {
        // Create user and get token
        const regRes = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'User Test',
                email: testEmail,
                pass: testPassword
            });
        userId = regRes.body.userId;

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: testEmail,
                pass: testPassword
            });
        token = loginRes.body.token;
    });

    afterAll(async () => {
        if (userId) {
            await db.execute('DELETE FROM login_logs WHERE user_id = ?', [userId]);
            await db.execute('DELETE FROM users WHERE id = ?', [userId]);
        }
    });

    describe('GET /api/user/me', () => {
        test('should return current user data with valid token', async () => {
            const res = await request(app)
                .get('/api/user/me')
                .set('Authorization', `Bearer ${token}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.user.email).toBe(testEmail);
        });

        test('should fail without token', async () => {
            const res = await request(app).get('/api/user/me');
            expect(res.statusCode).toBe(401);
        });
    });

    describe('PUT /api/user/profile', () => {
        test('should update profile successfully', async () => {
            const res = await request(app)
                .put('/api/user/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Updated Name',
                    email: testEmail, // keep same email
                    pass: 'NewStrongPass123'
                });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toContain('éxito');
        });
    });
});
