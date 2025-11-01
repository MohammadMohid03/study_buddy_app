import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Brain, BookOpen, Sparkles, Save, Edit3 } from 'lucide-react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import apiClient from '../api/axiosConfig';
import FloatingIcon from '../components/FloatingIcons';

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
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={['#1e1b4b', '#4c1d95', '#be185d']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Floating background icons */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <FloatingIcon icon={Brain} size={24} style={{ position: 'absolute', top: '15%', left: '8%' }} delay={0} />
        <FloatingIcon icon={BookOpen} size={20} style={{ position: 'absolute', top: '25%', right: '12%' }} delay={2000} />
        <FloatingIcon icon={Sparkles} size={22} style={{ position: 'absolute', bottom: '45%', left: '15%' }} delay={4000} />
        <FloatingIcon icon={Edit3} size={18} style={{ position: 'absolute', bottom: '30%', right: '10%' }} delay={6000} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Edit3 color="white" size={28} />
        </View>
        <Text style={styles.headerTitle}>
          {noteToEdit ? 'Edit Note' : 'Create Note'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {noteToEdit ? 'Update your study material' : 'Capture your learning moments'}
        </Text>
      </View>

      {/* Content Container - Positioned above tab bar */}
      <ScrollView 
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Note Title</Text>
          <BlurView intensity={15} tint="dark" style={styles.inputContainer}>
            <CustomInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Chapter 3: Photosynthesis"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.titleInput}
            />
          </BlurView>
        </View>

        {/* Content Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Note Content</Text>
          <BlurView intensity={15} tint="dark" style={styles.contentInputContainer}>
            <CustomInput
              value={content}
              onChangeText={setContent}
              placeholder="Enter your study notes here..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              multiline={true}
              style={styles.contentInput}
            />
          </BlurView>
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            onPress={handleSaveNote}
            style={styles.saveButton}
          >
            <LinearGradient
              colors={['#a855f7', '#9333ea']}
              style={styles.saveButtonGradient}
            >
              <Save size={20} color="white" />
              <Text style={styles.saveButtonText}>
                {noteToEdit ? 'Update Note' : 'Save Note'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  logoContainer: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  contentContainer: {
    flex: 1,
    marginBottom: 65, // Space for transparent tab bar
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  inputContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  contentInputContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minHeight: 200,
  },
  titleInput: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: 'white',
    fontSize: 16,
    padding: 16,
  },
  contentInput: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: 'white',
    fontSize: 16,
    padding: 16,
    minHeight: 180,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  saveButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default NoteEditorScreen;