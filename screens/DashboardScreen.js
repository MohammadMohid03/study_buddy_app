import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../api/axiosConfig';
import { removeToken } from '../utils/secureStore'; // <-- 1. IMPORT removeToken
import { Ionicons } from '@expo/vector-icons'; // 2. Import icons
import * as DocumentPicker from 'expo-document-picker'; // 1. Import document picker

const DashboardScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  // 3. CREATE THE LOGOUT FUNCTION
  const handleLogout = async () => {
    await removeToken();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  // 4. SET UP THE HEADER BUTTON
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
          <Ionicons name="log-out-outline" size={28} color="#007BFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Function to fetch notes from the server
  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get('/notes');
      setNotes(response.data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      setError('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // useFocusEffect is a hook from React Navigation that runs the effect
  // every time the user focuses on (navigates to) this screen.
  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [])
  );
  
  // Component to render for each item in the list
  const renderNote = ({ item }) => (
    // WRAP the View in a TouchableOpacity
    <TouchableOpacity onPress={() => navigation.navigate('NoteDetail', { note: item })}>
      <View style={styles.noteItem}>
        <Text style={styles.noteTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  // 2. NEW FUNCTION for handling PDF upload
  const handlePdfUpload = async () => {
    try {
      // Open the document picker
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (!result.canceled) {
        setLoading(true); // Show a loading spinner
        const pdfAsset = result.assets[0];

        // 3. Create FormData to send the file
        const formData = new FormData();
        formData.append('pdf', {
          uri: pdfAsset.uri,
          name: pdfAsset.name,
          type: pdfAsset.mimeType,
        });

        // 4. Make the API call with the correct headers for a file upload
        await apiClient.post('/notes/upload-pdf', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        // 5. Refresh the notes list
        fetchNotes(); 
      }
    } catch (error) {
      console.error('PDF Upload Error:', error);
      Alert.alert('Error', 'Failed to upload and process PDF.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={notes}
          renderItem={renderNote}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={<Text style={styles.emptyText}>No notes found. Create one!</Text>}
        />
      )}
      
      {/* Floating Action Button to create a new note */}
       <TouchableOpacity 
        style={[styles.fab, { right: 100 }]} // Position it next to the other one
        onPress={handlePdfUpload}
      >
        <Ionicons name="cloud-upload-outline" size={28} color="white" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('NoteEditor')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  noteItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: '#007BFF',
    borderRadius: 30,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 30,
    color: 'white',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#888',
  },
});

export default DashboardScreen;