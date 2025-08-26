import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const QuizScreen = ({ route, navigation }) => {
  // 1. Get the full quiz object passed from the NoteDetailScreen
  const { quiz } = route.params;
  const questions = quiz.questions;

  // 2. State to track the user's progress
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionIndex: 'selectedOption' }
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  // 3. Function to handle when an option is selected
  const handleSelectOption = (option) => {
    // Record the user's answer
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: option,
    });
  };
  
  // 4. Function to move to the next question or finish the quiz
  const handleNextQuestion = () => {
    // Check if the selected answer for the current question is correct
    const correctAnswer = currentQuestion.correctAnswer;
    if (selectedAnswers[currentQuestionIndex] === correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }

    // Move to the next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      // End of the quiz, navigate to results
      navigation.replace('QuizResult', {
        quizId: quiz._id,
        score: selectedAnswers[currentQuestionIndex] === correctAnswer ? score + 1 : score,
        totalQuestions: questions.length,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.progressText}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </Text>
      
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswers[currentQuestionIndex] === option && styles.selectedOption,
            ]}
            onPress={() => handleSelectOption(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity 
        style={[styles.nextButton, !selectedAnswers[currentQuestionIndex] && styles.disabledButton]}
        onPress={handleNextQuestion}
        disabled={!selectedAnswers[currentQuestionIndex]}
      >
        <Text style={styles.nextButtonText}>
          {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ... Add the styles below ...
export default QuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    justifyContent: 'space-between',
  },
  progressText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginBottom: 20,
  },
  questionContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#d0eaff',
    borderColor: '#007BFF',
  },
  optionText: {
    fontSize: 18,
  },
  nextButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#a9a9a9',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});