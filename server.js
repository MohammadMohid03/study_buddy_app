// 1. Import necessary packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose'); // NEW: Import mongoose

// 2. Configure environment variables
dotenv.config();

// 3. Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5001;

// NEW: Database Connection Function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// NEW: Call the connection function
connectDB();



// 4. Use Middleware
app.use(cors({
  origin: '*' 
}));
app.use(express.json());

//imports
const authRoutes = require('./routes/auth.js');
const noteRoutes = require('./routes/notes.js'); // <-- NEW
const aiRoutes = require('./routes/ai.js'); // <-- NEW
const quizRoutes = require('./routes/quizzes.js'); // <-- NEW

// 5. Define a basic route for testing
app.get('/', (req, res) => {
  res.send('AI Study Buddy API is running!');
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes); // <-- NEW
app.use('/api/ai', aiRoutes); // <-- NEW
app.use('/api/quizzes', quizRoutes); // <-- NEW

// 6. Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});