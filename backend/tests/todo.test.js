// backend/tests/todo.test.js
const request = require('supertest');
const app = require('../app'); // Ensure you export your app from app.js

describe('Todo API', () => {
  it('should add a new todo', async () => {
    const res = await request(app).post('/api/todos').send({
      title: 'Test Todo',
      detail: 'Test detail'
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });
});
