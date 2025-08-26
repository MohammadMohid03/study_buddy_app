import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import apiClient from '../api/axiosConfig';

const QuizResultScreen = ({ route, navigation }) => {
  // 1. Get the data passed from the QuizScreen
  const { quizId, score, totalQuestions } = route.params;

  // 2. Save the progress to the backend as soon as the screen loads
  useEffect(() => {
    const saveQuizProgress = async () => {
      try {
        await apiClient.post('/quizzes/progress', {
          quizId,
          score,
          totalQuestions,
        });
        // You can optionally show a success message, but it's not necessary
        console.log('Quiz progress saved successfully!');
      } catch (error) {
        console.error('Failed to save quiz progress:', error);
        // Alert the user if saving fails, as this is important data
        Alert.alert('Error', 'Could not save your quiz results. Please check your connection.');
      }
    };

    saveQuizProgress();
  }, [quizId, score, totalQuestions]); // The effect runs when these values are first received

  // 3. Calculate the percentage and a motivational message
  const percentage = useMemo(() => Math.round((score / totalQuestions) * 100), [score, totalQuestions]);
  const motivationalMessage = percentage >= 80 ? "Excellent work! 🚀" : "Great effort! Keep practicing. 👍";

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quiz Complete!</Text>
      
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Your Score</Text>
        <Text style={styles.score}>
          {score} / {totalQuestions}
        </Text>
        <Text style={styles.percentage}>({percentage}%)</Text>
      </View>

      <Text style={styles.motivation}>{motivationalMessage}</Text>
      
        <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.reset({
          index: 0,
          routes: [{ name: 'MainApp' }],
        })}
      >
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

// ... Add the styles below
export default QuizResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    width: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  scoreText: {
    fontSize: 24,
    color: '#888',
  },
  score: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#007BFF',
    marginVertical: 10,
  },
  percentage: {
    fontSize: 20,
    color: '#555',
  },
  motivation: {
    fontSize: 20,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});