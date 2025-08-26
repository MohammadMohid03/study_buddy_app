const Note = require('../models/Note.js');
const pdf = require('pdf-parse');
// 1. IMPORT our new AI function
const { generateNoteFromText } = require('./aiController.js');

// @desc    Get all notes for a logged-in user
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  // Thanks to our middleware, we have access to req.user
  const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(notes);
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Please provide a title and content' });
  }

  const note = await Note.create({
    user: req.user._id, // Associate the note with the logged-in user
    title,
    content,
  });

  res.status(201).json(note);
};
// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Ensure the user owns the note
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await note.deleteOne();
    res.status(200).json({ message: 'Note removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findById(req.params.id);

    if (!note) { return res.status(404).json({ message: 'Note not found' }); }
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    note.title = title || note.title;
    note.content = content || note.content;

    const updatedNote = await note.save();
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a note by uploading a PDF
// @route   POST /api/notes/upload-pdf
// @access  Private
const createNoteFromPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded.' });
    }

    const data = await pdf(req.file.buffer);
    const pdfText = data.text;

    // 2. CALL the centralized AI function
    const aiNote = await generateNoteFromText(pdfText);

    // 3. Create the note using the AI's response
    const newNote = await Note.create({
      user: req.user._id,
      title: aiNote.title,
      content: aiNote.content,
    });

    res.status(201).json(newNote);

  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ message: 'Server error processing PDF.' });
  }
};



module.exports = {
  getNotes,
  createNote,
  deleteNote,
  updateNote, // <-- EXPORT
  createNoteFromPdf,
};