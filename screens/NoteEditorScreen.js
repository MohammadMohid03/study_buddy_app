import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Text } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import apiClient from '../api/axiosConfig';

const NoteEditorScreen = ({ navigation, route }) => {
  const noteToEdit = route.params?.noteToEdit;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
    }
  }, [noteToEdit]);

  const handleSaveNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Validation Error', 'Please enter a title and content for your note.');
      return;
    }

    try {
      const noteData = { title, content };
      
      if (noteToEdit) {
        // UPDATE existing note
        await apiClient.put(`/notes/${noteToEdit._id}`, noteData);
      } else {
        // CREATE new note
        await apiClient.post('/notes', noteData);
      }
      
      // Go back to Dashboard. popToTop is good to ensure it refreshes.
      navigation.popToTop();

    } catch (error) {
      console.error('Failed to save note:', error.response?.data || error.message);
      Alert.alert('Error', 'Could not save the note. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Note Title</Text>
      <CustomInput
        value={title}
        onChangeText={setTitle}
        placeholder="e.g., Chapter 3: Photosynthesis"
        style={styles.titleInput}
      />

      <Text style={styles.label}>Note Content</Text>
      <CustomInput
        value={content}
        onChangeText={setContent}
        placeholder="Enter your study notes here..."
        multiline={true} // Allows for multiple lines of text
        style={styles.contentInput}
      />

      <CustomButton title="Save Note" onPress={handleSaveNote} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-start',
    marginLeft: '10%', // Aligns with the input fields
    marginBottom: 8,
  },
  titleInput: {
    height: 50,
    marginBottom: 20,
  },
  contentInput: {
    height: 200, // Taller input for content
    textAlignVertical: 'top', // Starts the text at the top for multiline
    paddingTop: 15,
  },
});

export default NoteEditorScreen;