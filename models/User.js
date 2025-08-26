const mongoose = require('mongoose');

// 1. Define the schema for a user
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Every username must be unique
      trim: true, // Removes whitespace from both ends
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// 2. Create the User model from the schema
const User = mongoose.model('User', userSchema);

// 3. Export the model
module.exports = User;