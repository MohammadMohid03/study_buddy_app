import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Vibration 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Brain, BookOpen, Sparkles, CheckCircle, XCircle, ArrowRight, Send } from 'lucide-react-native';
import FloatingIcon from '../components/FloatingIcons';

const QuizScreen = ({ route, navigation }) => {
  const { quiz } = route.params;
  const questions = quiz.questions;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Animation refs
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const fadeAnimation = useRef(new Animated.Value(1)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectOption = (option) => {
    if (!isAnswered) {
      setSelectedOption(option);
      // Small scale animation when selecting
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
      // Success animation
      Animated.parallel([
        Animated.timing(scaleAnimation, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(scaleAnimation, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnimation, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }, 300);
      });
    } else {
      // Error animation - shake and vibrate
      Vibration.vibrate(100);
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    // Slide out animation
    Animated.timing(slideAnimation, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedOption(null);
        setIsAnswered(false);
        
        // Reset animations
        slideAnimation.setValue(300);
        scaleAnimation.setValue(1);
        fadeAnimation.setValue(1);
        shakeAnimation.setValue(0);
        
        // Slide in animation
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        navigation.replace('QuizResult', {
          quizId: quiz._id,
          score: score,
          totalQuestions: questions.length,
        });
      }
    });
  };

  const getOptionStyle = (option) => {
    const stylesArray = [styles.optionButton];
    
    const isCorrect = option === currentQuestion.correctAnswer;
    const isSelected = option === selectedOption;

    if (isAnswered) {
      if (isCorrect) {
        stylesArray.push(styles.correctOption);
      } else if (isSelected && !isCorrect) {
        stylesArray.push(styles.incorrectOption);
      } else {
        stylesArray.push(styles.unselectedOption);
      }
    } else {
      if (isSelected) {
        stylesArray.push(styles.selectedOption);
      }
    }
    
    return stylesArray;
  };

  const getOptionIcon = (option) => {
    if (!isAnswered) return null;
    
    const isCorrect = option === currentQuestion.correctAnswer;
    const isSelected = option === selectedOption;
    
    if (isCorrect) {
      return <CheckCircle size={20} color="#22c55e" />;
    } else if (isSelected && !isCorrect) {
      return <XCircle size={20} color="#ef4444" />;
    }
    return null;
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
      </View>

      {/* Content Container - Positioned above tab bar */}
      <Animated.View style={[
        styles.contentContainer,
        {
          transform: [
            { translateX: slideAnimation },
            { translateX: shakeAnimation },
            { scale: scaleAnimation }
          ],
          opacity: fadeAnimation,
        }
      ]}>
        {/* Progress Header */}
        <BlurView intensity={15} tint="dark" style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
              ]} 
            />
          </View>
        </BlurView>
        
        {/* Question Container */}
        <BlurView intensity={15} tint="dark" style={styles.questionContainer}>
          <Brain color="rgba(255,255,255,0.7)" size={32} />
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </BlurView>

        {/* Options Container */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={getOptionStyle(option)}
              onPress={() => handleSelectOption(option)}
              disabled={isAnswered}
            >
              <BlurView intensity={10} tint="dark" style={styles.optionContent}>
                <Text style={styles.optionText}>{option}</Text>
                {getOptionIcon(option)}
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Action Button */}
        <View style={styles.actionContainer}>
          {!isAnswered ? (
            <TouchableOpacity 
              style={[styles.actionButton, !selectedOption && styles.disabledButton]}
              onPress={handleSubmitAnswer}
              disabled={!selectedOption}
            >
              <LinearGradient
                colors={!selectedOption ? ['rgba(168, 85, 247, 0.5)', 'rgba(168, 85, 247, 0.3)'] : ['#a855f7', '#9333ea']}
                style={styles.actionButtonGradient}
              >
                <Send size={20} color="white" />
                <Text style={styles.actionButtonText}>Submit Answer</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleNextQuestion}
            >
              <LinearGradient
                colors={['#22c55e', '#16a34a']}
                style={styles.actionButtonGradient}
              >
                <ArrowRight size={20} color="white" />
                <Text style={styles.actionButtonText}>
                  {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 85, // Space for transparent tab bar + extra padding
    justifyContent: 'space-between',
  },
  progressContainer: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#a855f7',
    borderRadius: 3,
  },
  questionContainer: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 24,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginTop: 12,
    lineHeight: 26,
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  selectedOption: {
    borderColor: '#a855f7',
    transform: [{ scale: 1.02 }],
  },
  correctOption: {
    borderColor: '#22c55e',
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  incorrectOption: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  unselectedOption: {
    opacity: 0.6,
  },
  optionText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    flex: 1,
  },
  actionContainer: {
    marginTop: 20,
  },
  actionButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.5,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  actionButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default QuizScreen;