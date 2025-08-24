import request from 'supertest';
import app from '../src/index'; // Adjust path to your app entry point

describe('User API', () => {
  it('should register a user', async () => {
    const res = await request(app)
      .post('/user/register')
      .send({ username: 'test', password: 'pass123', role: 'user' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered');
  });
});