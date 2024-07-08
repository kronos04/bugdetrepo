const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const { authenticateUser } = require('../utils/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

describe('Login', () => {
  describe('authenticateUser', () => {
    it('should return null for invalid email and password', async () => {
      const user = await authenticateUser('invalid@email.com', 'wrongpassword');
      expect(user).toBeNull();
    });

    it('should return user object for valid email and password', async () => {
      const user = await authenticateUser('user@example.com', 'password');
      expect(user).toEqual({ id: 1, email: 'user@example.com', password: 'password' });
    });
  });

  describe('POST /api/login', () => {
    it('should return 401 for invalid email and password', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ email: 'invalid@email.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should return a JWT token for valid email and password', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ email: 'user@example.com', password: 'password' });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      const decoded = jwt.verify(response.body.token, JWT_SECRET);
      expect(decoded.userId).toBe(1);
    });
  });

  describe('requireAuth middleware', () => {
    it('should return 401 for requests without a valid token', async () => {
      const response = await request(app)
        .get('/protected-route')
        .set('Authorization', 'invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });

    it('should allow requests with a valid token', async () => {
      const token = jwt.sign({ userId: 1 }, JWT_SECRET);
      const response = await request(app)
        .get('/protected-route')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });
});
