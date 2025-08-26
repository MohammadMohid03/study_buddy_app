const express = require('express');
const router = express.Router();
const multer = require('multer'); // 1. Import multer
const { 
  getNotes, 
  createNote, 
  deleteNote, 
  updateNote,
  createNoteFromPdf // 2. Import the new controller
} = require('../controllers/noteController.js');
const { protect } = require('../middleware/authMiddleware.js');

// 3. Configure multer. memoryStorage is good for handling files as buffers.
const upload = multer({ storage: multer.memoryStorage() });

// ... existing routes ...
router.route('/').get(protect, getNotes).post(protect, createNote);
router.route('/:id').delete(protect, deleteNote).put(protect, updateNote);

// 4. Add the new PDF upload route
// 'upload.single('pdf')' tells multer to expect one file, in a field named 'pdf'
router.post('/upload-pdf', protect, upload.single('pdf'), createNoteFromPdf);

module.exports = router;