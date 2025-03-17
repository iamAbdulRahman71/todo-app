jest.setTimeout(30000); // Increase timeout to allow for MongoDB setup

const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../app'); // Ensure app.js exports the Express app without starting the server in test mode
const User = require('../models/User');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let testUser;

beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // Create a test user with a hashed password
  const hashedPassword = await bcrypt.hash('testpassword', 10);
  testUser = await User.create({
    username: 'testuser',
    password: hashedPassword,
  });
});

afterAll(async () => {
  // Clean up database connections and stop in-memory MongoDB
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  // Optionally, clear collections between tests if needed
});

describe('Auth API', () => {
  test('POST /api/auth/login - successful login returns token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    // Verify that the token is valid and contains the correct payload
    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded.user.id).toEqual(testUser._id.toString());
  });

  test('POST /api/auth/login - invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword',
      });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  test('GET /api/auth/current - returns current user info', async () => {
    // Manually create a valid JWT for the test user
    const token = jwt.sign(
      { user: { id: testUser._id.toString() } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const res = await request(app)
      .get('/api/auth/current')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toEqual('testuser');
    // Ensure the password field is not returned
    expect(res.body).not.toHaveProperty('password');
  });
});
