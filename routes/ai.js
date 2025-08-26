const express = require('express');
const router = express.Router();
// 1. Import the new function
const { 
  generateFlashcards, 
  generateChatResponse, 
  generateQuiz 
} = require('../controllers/aiController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Existing routes
router.post('/flashcards', protect, generateFlashcards);
router.post('/chat', protect, generateChatResponse);

// 2. Add the new quiz route
router.post('/quiz', protect, generateQuiz);

module.exports = router;