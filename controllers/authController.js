const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register/Signup a new user
// @route   POST /api/auth/signup
// @access  Public
const signupUser = async (req, res) => {
  try {
    // 1. Get username and password from the request body
    const { username, password } = req.body;

    // 2. Basic validation: check if fields are empty
    if (!username || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // 3. Check if the user already exists in the database
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 4. Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create the new user in the database
    const user = await User.create({
      username,
      password: hashedPassword,
    });

    // 6. If user was created successfully, send back a response
    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        token: generateToken(user._id), // Generate a token for the new user
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    // 1. Get username and password from request body
    const { username, password } = req.body;

    // 2. Find the user in the database by their username
    const user = await User.findOne({ username });

    // 3. Check if user exists AND if the provided password is correct
    //    bcrypt.compare will hash the incoming password and compare it to the hashed password in the DB
    if (user && (await bcrypt.compare(password, user.password))) {
      // 4. If credentials are correct, send back user data and a new token
      res.status(200).json({
        _id: user.id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      // 5. If credentials are wrong, send an error
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


module.exports = {
  signupUser,
  loginUser, // Add this line
};