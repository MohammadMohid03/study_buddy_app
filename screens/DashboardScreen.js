import React, { useState, useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Brain, BookOpen, Sparkles, Upload, Plus, LogOut } from 'lucide-react-native';
import apiClient from '../api/axiosConfig';
import { removeToken } from '../utils/secureStore';
import { getErrorMessage } from '../utils/errorHandler';
import FloatingIcon from '../components/FloatingIcons';

const DashboardScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  // --- LOGIC ---

  const handleLogout = async () => {
    await removeToken();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
          <LogOut size={24} color="white" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerTransparent: true,
      headerTintColor: 'white',
      headerTitleStyle: {
        color: 'white',
        fontWeight: 'bold',
      },
    });
  }, [navigation]);

  const fetchNotes = async () => {
    if (!isRefreshing) {
      setLoading(true);
    }
    setError('');
    try {
      const response = await apiClient.get('/notes');
      setNotes(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchNotes(); }, []));

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchNotes();
  };

  const handlePdfUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (!result.canceled) {
        setLoading(true);
        const pdfAsset = result.assets[0];

        const formData = new FormData();
        formData.append('pdf', {
          uri: pdfAsset.uri,
          name: pdfAsset.name,
          type: pdfAsset.mimeType,
        });

        await apiClient.post('/notes/upload-pdf', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        fetchNotes();
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Upload Failed', getErrorMessage(error));
    }
  };

  // --- RENDER LOGIC ---

  const renderNote = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('NoteDetail', { note: item })}>
      <BlurView intensity={15} tint="dark" style={styles.noteItem}>
        <Text style={styles.noteTitle}>{item.title}</Text>
      </BlurView>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1e1b4b', '#4c1d95', '#be185d']}
          style={StyleSheet.absoluteFill}
        />
        
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <FloatingIcon icon={Brain} size={24} style={{ position: 'absolute', top: '20%', left: '10%' }} delay={0} />
          <FloatingIcon icon={BookOpen} size={20} style={{ position: 'absolute', top: '30%', right: '15%' }} delay={1500} />
          <FloatingIcon icon={Sparkles} size={22} style={{ position: 'absolute', bottom: '40%', left: '20%' }} delay={3000} />
        </View>

        <View style={styles.centered}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Loading Notes...</Text>
        </View>
      </View>
    );
  }

  if (error && notes.length === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1e1b4b', '#4c1d95', '#be185d']}
          style={StyleSheet.absoluteFill}
        />
        
        <View style={styles.centered}>
          <BlurView intensity={20} tint="dark" style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchNotes} style={styles.retryButton}>
              <Text style={styles.retryText}>Tap to retry</Text>
            </TouchableOpacity>
          </BlurView>
        </View>
      </View>
    );
  }

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
        <FloatingIcon icon={Sparkles} size={22} style={{ position: 'absolute', bottom: '35%', left: '15%' }} delay={4000} />
        <FloatingIcon icon={BookOpen} size={18} style={{ position: 'absolute', bottom: '20%', right: '10%' }} delay={6000} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Brain color="white" size={28} />
        </View>
        <Text style={styles.title}>My Notes</Text>
        <Text style={styles.subtitle}>Your learning journey continues</Text>
      </View>

      {/* Notes List */}
      <View style={styles.contentContainer}>
        <FlatList
          data={notes}
          renderItem={renderNote}
          keyExtractor={(item) => item._id}
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading && (
              <BlurView intensity={15} tint="dark" style={styles.emptyContainer}>
                <BookOpen color="rgba(255,255,255,0.7)" size={48} />
                <Text style={styles.emptyText}>No notes found. Create one!</Text>
              </BlurView>
            )
          }
        />
      </View>
      
      {/* Floating Action Buttons - Positioned above tab bar */}
      <TouchableOpacity 
        style={[styles.fab, styles.uploadFab]}
        onPress={handlePdfUpload}
      >
        <LinearGradient
          colors={['#06b6d4', '#0891b2']}
          style={styles.fabGradient}
        >
          <Upload size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('NoteEditor')}
      >
        <LinearGradient
          colors={['#a855f7', '#9333ea']}
          style={styles.fabGradient}
        >
          <Plus size={28} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

// --- STYLES ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 140, // Increased to account for FABs + tab bar
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  noteItem: {
    padding: 20,
    marginVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 85, // Positioned above the 65px tab bar with some spacing
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  uploadFab: {
    right: 90, // Positioned next to the main FAB
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    maxWidth: 300,
    overflow: 'hidden',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#a855f7',
  },
  retryText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    marginTop: 40,
    overflow: 'hidden',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
});

export default DashboardScreen;