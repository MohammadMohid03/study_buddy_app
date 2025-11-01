import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useLayoutEffect } from 'react';
import { Brain, BookOpen, Sparkles, Edit3, Trash2, Zap, Target } from 'lucide-react-native';
import CustomButton from '../components/CustomButton';
import apiClient from '../api/axiosConfig';
import Flashcard from '../components/Flashcard';
import Markdown from 'react-native-markdown-display';
import FloatingIcon from '../components/FloatingIcons';

const { width } = Dimensions.get('window');

const NoteDetailScreen = ({ route, navigation }) => {
  const { note } = route.params;
  const [flashcards, setFlashcards] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);

  // Animation refs
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerScale = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslateY = useRef(new Animated.Value(50)).current;
  const flashcardAnimations = useRef({}).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  // Get note category for theming
  const getNoteCategory = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('math') || lowerTitle.includes('science') || lowerTitle.includes('physics') || lowerTitle.includes('chemistry')) {
      return 'science';
    } else if (lowerTitle.includes('history') || lowerTitle.includes('literature') || lowerTitle.includes('english') || lowerTitle.includes('art')) {
      return 'humanities';
    } else if (lowerTitle.includes('code') || lowerTitle.includes('programming') || lowerTitle.includes('tech') || lowerTitle.includes('computer')) {
      return 'tech';
    }
    return 'general';
  };

  const getCategoryGradient = (category) => {
    switch (category) {
      case 'science':
        return ['#1e1b4b', '#065f46', '#be185d']; // Blue-Green-Pink
      case 'humanities':
        return ['#1e1b4b', '#ea580c', '#be185d']; // Blue-Orange-Pink
      case 'tech':
        return ['#1e1b4b', '#1e40af', '#7c3aed']; // Blue-Blue-Purple
      default:
        return ['#1e1b4b', '#4c1d95', '#be185d']; // Default gradient
    }
  };

  const category = getNoteCategory(note.title);
  const gradientColors = getCategoryGradient(category);

  // Entry animations
  useEffect(() => {
    const entryAnimations = Animated.stagger(200, [
      Animated.spring(headerScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(buttonsTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }),
    ]);

    entryAnimations.start();

    // Pulse animation for floating elements
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, { toValue: 1.1, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnimation, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    );
    pulse.start();

    return () => {
      pulse.stop();
    };
  }, []);

  // Flashcard animations
  const animateFlashcardIn = (index) => {
    if (!flashcardAnimations[index]) {
      flashcardAnimations[index] = new Animated.Value(0);
    }
    
    Animated.spring(flashcardAnimations[index], {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
      delay: index * 150,
    }).start();
  };

  const handleGenerateFlashcards = async () => {
    setLoading(true);
    setFlashcards([]);
    
    try {
      const response = await apiClient.post('/ai/flashcards', { text: note.content });
      console.log("AI Response from Backend:", JSON.stringify(response.data, null, 2));
      
      setFlashcards(response.data);
      
      // Animate flashcards in
      response.data.forEach((_, index) => {
        setTimeout(() => animateFlashcardIn(index), index * 100);
      });
    } catch (error) {
      console.error('Failed to generate flashcards:', error);
      Alert.alert('Error', 'Could not generate flashcards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    try {
      const response = await apiClient.post('/ai/quiz', { text: note.content });
      const generatedQuestions = response.data;
      
      if (generatedQuestions && generatedQuestions.length > 0) {
        const saveQuizResponse = await apiClient.post('/quizzes', {
          noteId: note._id,
          questions: generatedQuestions,
        });
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
  
  const handleDelete = useCallback(() => {
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
  }, [note._id, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('NoteEditor', { noteToEdit: note })} 
            style={styles.headerButton}
            activeOpacity={0.7}
          >
            <Edit3 size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleDelete} 
            style={[styles.headerButton, { marginRight: 15 }]}
            activeOpacity={0.7}
          >
            <Trash2 size={24} color="#ff6b6b" />
          </TouchableOpacity>
        </View>
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
  }, [navigation, note, handleDelete]);

  // Parallax calculations
  const parallaxOffset = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -40],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  });

  const CustomAnimatedButton = ({ title, onPress, loading, icon: Icon, color = '#a855f7', delay = 0 }) => (
    <Animated.View 
      style={[
        styles.buttonContainer,
        { 
          transform: [{ translateY: buttonsTranslateY }],
          opacity: contentOpacity,
        }
      ]}
    >
      <TouchableOpacity 
        onPress={onPress} 
        disabled={loading}
        activeOpacity={0.8}
        style={styles.customButton}
      >
        <BlurView intensity={20} tint="dark" style={styles.buttonBlur}>
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Icon size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>{title}</Text>
            </>
          )}
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFlashcard = ({ item, index }) => {
    const animatedStyle = flashcardAnimations[index] ? {
      opacity: flashcardAnimations[index],
      transform: [
        {
          translateY: flashcardAnimations[index]?.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }) || 0,
        },
        {
          scale: flashcardAnimations[index]?.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          }) || 1,
        },
      ],
    } : {};

    return (
      <Animated.View style={[styles.flashcardWrapper, animatedStyle]}>
        <Flashcard front={item.front} back={item.back} />
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Animated Background */}
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Floating Background Icons with Parallax */}
      <Animated.View 
        style={[
          StyleSheet.absoluteFill, 
          { transform: [{ translateY: parallaxOffset }, { scale: pulseAnimation }] }
        ]} 
        pointerEvents="none"
      >
        <FloatingIcon icon={Brain} size={28} style={{ position: 'absolute', top: '10%', left: '5%' }} delay={0} />
        <FloatingIcon icon={BookOpen} size={24} style={{ position: 'absolute', top: '20%', right: '8%' }} delay={2000} />
        <FloatingIcon icon={Sparkles} size={26} style={{ position: 'absolute', bottom: '25%', left: '10%' }} delay={4000} />
        <FloatingIcon icon={Target} size={22} style={{ position: 'absolute', bottom: '15%', right: '12%' }} delay={6000} />
      </Animated.View>

      {/* Main Content */}
      <Animated.FlatList
        style={styles.flatList}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <>
            {/* Note Header */}
            <Animated.View 
              style={[
                styles.headerContainer,
                { 
                  transform: [{ scale: headerScale }],
                  opacity: headerOpacity,
                }
              ]}
            >
              <BlurView intensity={25} tint="dark" style={styles.noteHeaderBlur}>
                <View style={styles.categoryIndicator}>
                  <Text style={styles.categoryText}>{category.toUpperCase()}</Text>
                </View>
                <Text style={styles.title}>{note.title}</Text>
              </BlurView>
            </Animated.View>

            {/* Note Content */}
            <Animated.View 
              style={[
                styles.contentContainer,
                { opacity: contentOpacity }
              ]}
            >
              <BlurView intensity={20} tint="dark" style={styles.contentBlur}>
                <Markdown style={themedMarkdownStyles}>
                  {note.content}
                </Markdown>
              </BlurView>
            </Animated.View>
            
            {/* Action Buttons */}
            <CustomAnimatedButton 
              title="Generate Flashcards" 
              onPress={handleGenerateFlashcards}
              loading={loading}
              icon={Zap}
              color="#a855f7"
            />

            <CustomAnimatedButton 
              title="Generate Quiz" 
              onPress={handleGenerateQuiz}
              loading={quizLoading}
              icon={Target}
              color="#06b6d4"
            />

            {/* Flashcards Header */}
            {flashcards.length > 0 && (
              <Animated.View 
                style={[
                  styles.flashcardsHeaderContainer,
                  { 
                    opacity: contentOpacity,
                    transform: [{ translateY: buttonsTranslateY }]
                  }
                ]}
              >
                <BlurView intensity={15} tint="dark" style={styles.headerBlur}>
                  <Sparkles size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.flashcardsHeader}>Generated Flashcards</Text>
                </BlurView>
              </Animated.View>
            )}
          </>
        }
        data={flashcards}
        renderItem={renderFlashcard}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={
          !loading && flashcards.length === 0 ? (
            <Animated.View style={[styles.emptyContainer, { opacity: contentOpacity }]}>
              <BlurView intensity={15} tint="dark" style={styles.emptyBlur}>
                <BookOpen size={48} color="rgba(255,255,255,0.6)" />
                <Text style={styles.emptyText}>
                  Tap "Generate Flashcards" to create study materials!
                </Text>
              </BlurView>
            </Animated.View>
          ) : null
        }
      />
    </View>
  );
};

// Themed Markdown Styles
const themedMarkdownStyles = StyleSheet.create({
  body: {
    fontSize: 16,
    lineHeight: 26,
    color: 'rgba(255,255,255,0.9)',
  },
  strong: {
    fontWeight: 'bold',
    color: 'white',
  },
  bullet_list: {
    marginBottom: 12,
  },
  list_item: {
    fontSize: 16,
    lineHeight: 26,
    color: 'rgba(255,255,255,0.9)',
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  heading2: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  code_inline: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    color: '#a855f7',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingTop: 120,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  headerContainer: {
    marginBottom: 20,
  },
  noteHeaderBlur: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  categoryIndicator: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 36,
  },
  contentContainer: {
    marginBottom: 24,
  },
  contentBlur: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  buttonContainer: {
    marginBottom: 12,
  },
  customButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  flashcardsHeaderContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  headerBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  flashcardsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  flashcardWrapper: {
    marginBottom: 16,
  },
  emptyContainer: {
    marginTop: 40,
  },
  emptyBlur: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
  },
});

export default NoteDetailScreen;