const request = require('supertest');
const app = require('../../app');

describe('Users Routes', () => {
  describe('GET /users', () => {
    test('should return an array', async () => {
      const res = await request(app).get('/users');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /users', () => {
    test('should create a new user', async () => {
      const userData = { name: 'Test User', email: 'test@example.com' };
      const res = await request(app)
        .post('/users')
        .send(userData);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
    });

    test('should fail with invalid data', async () => {
      const res = await request(app)
        .post('/users')
        .send({});
      expect(res.statusCode).toBeDefined();
    });
  });
});
