const express = require('express');
const router = express.Router();
const { saveQuiz, saveProgress, getProgress } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

// All these routes should be protected
router.post('/', protect, saveQuiz);
router.post('/progress', protect, saveProgress);
router.get('/progress', protect, getProgress);

module.exports = router;