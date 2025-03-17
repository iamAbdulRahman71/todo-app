// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/login - to log in the user
router.post('/login', authController.login);

// GET /api/auth/current - to get current user info (protected route)
router.get('/current', authMiddleware, authController.getCurrentUser);

module.exports = router;
