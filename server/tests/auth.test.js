require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

describe('Auth Integration Tests', () => {
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'StrongPass123';
    let userId;

    afterAll(async () => {
        // Cleanup test data
        if (userId) {
            await db.execute('DELETE FROM login_logs WHERE user_id = ?', [userId]);
            await db.execute('DELETE FROM users WHERE id = ?', [userId]);
        }
        // Also cleanup failed attempts if any
        await db.execute('DELETE FROM login_logs WHERE email_attempted = ?', [testEmail]);
    });

    describe('POST /api/auth/register', () => {
        test('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test Jest User',
                    email: testEmail,
                    pass: testPassword
                });
            
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('userId');
            userId = res.body.userId;
        });

        test('should fail if email already exists', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Duplicate User',
                    email: testEmail,
                    pass: testPassword
                });
            
            expect(res.statusCode).toBe(409);
            expect(res.body.message).toContain('ya existe');
        });

        test('should fail with invalid data', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: '',
                    email: 'invalid-email',
                    pass: 'short'
                });
            
            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /api/auth/login', () => {
        test('should login successfuly with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testEmail,
                    pass: testPassword
                });
            
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user.email).toBe(testEmail);
        });

        test('should fail with incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testEmail,
                    pass: 'WrongPass123'
                });
            
            expect(res.statusCode).toBe(401);
        });
    });
});
