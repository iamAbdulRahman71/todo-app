jest.setTimeout(30000); // Increase timeout if needed

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const TodoList = require('../models/TodoList');
const TodoListItem = require('../models/TodoListItem');

// Override the auth middleware for testing
jest.mock('../middleware/authMiddleware', () => {
  const mongoose = require('mongoose');
  const testUserId = new mongoose.Types.ObjectId().toString();
  return (req, res, next) => {
    req.user = { id: testUserId };
    next();
  };
});

// Use mongodb-memory-server for in-memory MongoDB instance
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  // Clear collections after each test
  await TodoList.deleteMany({});
  await TodoListItem.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Todos API', () => {
  test('GET /api/todos should return an empty array when no lists exist', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  // ... other tests remain unchanged
});
