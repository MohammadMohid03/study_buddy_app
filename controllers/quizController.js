const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');

// @desc    Save a newly generated quiz
// @route   POST /api/quizzes
// @access  Private
const saveQuiz = async (req, res) => {
  try {
    const { noteId, questions } = req.body;
    const quiz = await Quiz.create({
      user: req.user._id,
      note: noteId,
      questions,
    });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Error saving quiz', error: error.message });
  }
};

// @desc    Save the result of a completed quiz
// @route   POST /api/quizzes/progress
// @access  Private
const saveProgress = async (req, res) => {
  try {
    const { quizId, score, totalQuestions } = req.body;
    const progress = await Progress.create({
      user: req.user._id,
      quiz: quizId,
      score,
      totalQuestions,
    });
    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error saving progress', error: error.message });
  }
};

// @desc    Get all progress records for a user
// @route   GET /api/quizzes/progress
// @access  Private
const getProgress = async (req, res) => {
  try {
    const progressRecords = await Progress.find({ user: req.user._id })
      .sort({ createdAt: -1 }) // Get the most recent first
      .populate('quiz'); // This is cool: it fetches the related quiz details too!
      
    res.status(200).json(progressRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
};

module.exports = {
  saveQuiz,
  saveProgress,
  getProgress,
};