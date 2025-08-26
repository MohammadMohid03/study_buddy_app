import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, // We will keep ScrollView for the main layout
  Alert, 
  ActivityIndicator,
  FlatList,
  TouchableOpacity // <-- ADD THIS // 1. IMPORT FlatList
} from 'react-native';
import CustomButton from '../components/CustomButton';
import apiClient from '../api/axiosConfig';
import Flashcard from '../components/Flashcard'; // 2. IMPORT the Flashcard component
import { useLayoutEffect } from 'react'; // Add this if not there
import { Ionicons } from '@expo/vector-icons'; // Add this if not there

const NoteDetailScreen = ({ route, navigation }) => {
  const { note } = route.params;
  const [flashcards, setFlashcards] = useState([]);
  const [quiz, setQuiz] = useState([]); // <-- 1. NEW STATE FOR QUIZ
  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false); // Separate loading state for quiz

  const handleGenerateFlashcards = async () => {
    // ... this function remains the same
    setLoading(true);
    setFlashcards([]);
    try {
      const response = await apiClient.post('/ai/flashcards', { text: note.content });

      console.log("AI Response from Backend:", JSON.stringify(response.data, null, 2));

      setFlashcards(response.data);
    } catch (error) {
      console.error('Failed to generate flashcards:', error);
      Alert.alert('Error', 'Could not generate flashcards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. NEW FUNCTION TO HANDLE QUIZ GENERATION
  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    try {
      // Call the AI endpoint to get quiz questions
      const response = await apiClient.post('/ai/quiz', { text: note.content });
      const generatedQuestions = response.data;
      
      if (generatedQuestions && generatedQuestions.length > 0) {
        // Save the quiz to our DB to get a persistent Quiz ID
        const saveQuizResponse = await apiClient.post('/quizzes', {
          noteId: note._id,
          questions: generatedQuestions,
        });

        // Navigate to the Quiz screen, passing the saved quiz object
        navigation.navigate('Quiz', { quiz: saveQuizResponse.data });
      } else {
        Alert.alert('Error', 'Could not generate a quiz from this note.');
      }
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      Alert.alert('Error', 'Could not generate quiz. Please try again.');
    } finally {
      setQuizLoading(false);
    }
  };

  
  const handleDelete = () => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to permanently delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await apiClient.delete(`/notes/${note._id}`);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Could not delete the note.');
            }
          } 
        }
      ]
    );
  };

   useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('NoteEditor', { noteToEdit: note })} 
            style={{ marginRight: 20 }}
          >
            <Ionicons name="pencil-outline" size={26} color="#007BFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={{ marginRight: 15 }}>
            <Ionicons name="trash-outline" size={26} color="red" />
          </TouchableOpacity>
        </View>
      )
    });
  }, [navigation, note]);

  return (
    // 3. USE A FLATLIST AS THE MAIN CONTAINER INSTEAD OF SCROLLVIEW
    <FlatList
      style={styles.container}
      // The ListHeaderComponent is a neat way to put content *above* the list items
      ListHeaderComponent={
         <>
          <View style={styles.noteContainer}>
            <Text style={styles.title}>{note.title}</Text>
            <Text style={styles.content}>{note.content}</Text>
          </View>
          
          <CustomButton title="✨ Generate Flashcards" onPress={handleGenerateFlashcards} />
          {/* 3. NEW BUTTON FOR QUIZZES */}
          <CustomButton 
            title="🧠 Generate Quiz" 
            onPress={handleGenerateQuiz} 
            style={{ marginTop: 10, backgroundColor: '#28a745' }} // A different color
          />

          {/* Show a loader specifically for the quiz button */}
          {quizLoading && <ActivityIndicator size="large" color="#28a745" style={{ marginVertical: 20 }} />}
          
          {loading && <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />}
          {flashcards.length > 0 && <Text style={styles.flashcardsHeader}>Generated Flashcards:</Text>}
        </>
      }
      // These are the props for the list itself
      data={flashcards}
      renderItem={({ item }) => <Flashcard front={item.front} back={item.back} />}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={
        !loading ? <Text style={styles.emptyText}>Click "Generate Flashcards" to begin!</Text> : null
      }
    />
  );

};

// 4. UPDATE STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1, // Make sure it takes up the full screen
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  noteContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  loader: {
    marginVertical: 20,
  },
  flashcardsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  }
});

export default NoteDetailScreen;