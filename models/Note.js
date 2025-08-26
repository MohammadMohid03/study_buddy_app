const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    // This creates a relationship between the Note and the User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This tells Mongoose the ObjectId refers to a document in the 'User' collection
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Note', noteSchema);