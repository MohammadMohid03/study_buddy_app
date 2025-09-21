const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI client with the API key from our .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Generate flashcards from a note's content
// @route   POST /api/ai/flashcards
// @access  Private
const generateFlashcards = async (req, res) => {
  try {
    // 1. Get the note content from the request body
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Note text is required' });
    }

    // 2. Select the Gemini model we want to use
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    // 3. This is the "prompt" - our instructions to the AI
    const prompt = `
      Based on the following text, generate a set of flashcards for studying.
      Each flashcard should have a "front" with a key term or a question, and a "back" with the definition or answer.
      Return the response as a valid JSON array of objects, where each object has a "front" and a "back" key.
      Do NOT include any text outside of the JSON array itself.

      Text: """
      ${text}
      """
    `;

    // 4. Send the prompt to the model and wait for the result
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();

   // 5. The AI's response might include markdown and other text. We need to extract only the JSON array.
let jsonArrayString;
const jsonMatch = jsonText.match(/\[[\s\S]*\]/); // This regex finds the first occurrence of [...]

if (jsonMatch && jsonMatch) {
  jsonArrayString = jsonMatch;
} else {
  // If no array is found, we can't proceed.
  throw new Error("Valid JSON array not found in AI response.");
}

const flashcards = JSON.parse(jsonArrayString); // Parse only the extracted array string

    // 6. Send the structured flashcard data back to the client
    res.status(200).json(flashcards);

  } catch (error) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({ message: 'Failed to generate flashcards from AI service' });
  }
};
// =================================================================
// NEW FUNCTION STARTS HERE
// =================================================================

// @desc    Generate a conversational response for the AI tutor
// @route   POST /api/ai/chat
// @access  Private
const generateChatResponse = async (req, res) => {
  try {
    // 1. Get the user's message from the request body
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'User message is required' });
    }

    // 2. Select the model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    
    // 3. This is our "system prompt" or persona for the AI
    const prompt = `
      You are a friendly, encouraging, and knowledgeable AI Study Tutor. 
      A student has asked you a question. Your goal is to explain the concept in a simple and easy-to-understand way.
      Keep your response concise and helpful.

      Student's Question: "${message}"
    `;

    // 4. Send the prompt and get the text-only response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Send the AI's text response back to the client
    res.status(200).json({ reply: text });

  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ message: 'Failed to get response from AI tutor' });
  }
};

const generateQuiz = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Note text is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    
    // Prompt engineered to request a specific JSON structure for a quiz
    const prompt = `
      Analyze the following text and act as a helpful study assistant. Your task is to generate a multiple-choice quiz that covers all the main concepts in the text.
      The number of questions should be proportional to the length and density of the information provided. For a short text with only a few key points, generate 3-4 questions. For a longer, more detailed text, generate between 5 and 10 questions. Your goal is to create a comprehensive review of the material.
      Return the response as a valid JSON array of objects.
      Each object must have the following keys: "question" (a string), "options" (an array of exactly 4 strings), and "correctAnswer" (a string that exactly matches one of the options).
      Do NOT include any text outside of the JSON array itself.

      Text: """
      ${text}
      """
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();

    // Use the same robust JSON extraction logic
    let jsonArrayString;
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (jsonMatch && jsonMatch[0]) {
      jsonArrayString = jsonMatch[0];
    } else {
      throw new Error("Valid JSON array for quiz not found in AI response.");
    }

    const quiz = JSON.parse(jsonArrayString);
    res.status(200).json(quiz);

  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ message: 'Failed to generate quiz from AI service' });
  }
};

// NEW, EXPORTABLE FUNCTION
const generateNoteFromText = async (text) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
  const prompt = `
    Analyze the following text. Your task is to act as a study assistant and create a concise and well-structured note from it.
    Generate a response as a valid JSON object with two keys: "title" and "content".
    The "title" should be a short, descriptive title for the note.
    The "content" should be a summary of the key points, formatted for readability.
    Do NOT include any text outside of the JSON object itself.

    Text: """
    ${text.substring(0, 50000)} 
    """
  `;
  const result = await model.generateContent(prompt);
const response = await result.response;
const jsonText = response.text();

// This new logic finds the first JSON object in the response text
let jsonObjectString;
const jsonMatch = jsonText.match(/\{[\s\S]*\}/); // Regex to find text between `{` and `}`

if (jsonMatch && jsonMatch[0]) {
  jsonObjectString = jsonMatch[0];
} else {
  // If no object is found, we can't proceed.
  throw new Error("Valid JSON object not found in AI response.");
}

return JSON.parse(jsonObjectString); // Parse only the extracted object string
};

module.exports = {
  generateFlashcards,
  generateChatResponse,
  generateQuiz,
  generateNoteFromText, // <-- EXPORT THE NEW FUNCTION
};