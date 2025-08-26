const express = require('express');
const router = express.Router();

// 1. Import BOTH controller functions now
const { signupUser, loginUser } = require('../controllers/authController');

// Signup route
router.post('/signup', signupUser);

// 2. Add the new login route
router.post('/login', loginUser);

module.exports = router;