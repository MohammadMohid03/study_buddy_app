import React, { useEffect, useMemo, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Animated, 
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Brain, BookOpen, Sparkles, Award, Trophy, Star, Home, TrendingUp } from 'lucide-react-native';
import apiClient from '../api/axiosConfig';
import FloatingIcon from '../components/FloatingIcons';

const { width } = Dimensions.get('window');

const QuizResultScreen = ({ route, navigation }) => {
  const { quizId, score, totalQuestions } = route.params;

  // Animation refs
  const scaleAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const bounceAnimation = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const confettiAnimation = useRef(new Animated.Value(0)).current;

  const percentage = useMemo(() => Math.round((score / totalQuestions) * 100), [score, totalQuestions]);
  
  const getPerformanceData = useMemo(() => {
    if (percentage >= 90) {
      return {
        icon: Trophy,
        color: '#ffd700',
        message: 'Outstanding Performance!',
        subtitle: 'You\'re mastering this subject',
        gradient: ['#ffd700', '#ffed4e']
      };
    } else if (percentage >= 80) {
      return {
        icon: Award,
        color: '#22c55e',
        message: 'Excellent Work!',
        subtitle: 'Keep up the great progress',
        gradient: ['#22c55e', '#16a34a']
      };
    } else if (percentage >= 60) {
      return {
        icon: Star,
        color: '#a855f7',
        message: 'Good Effort!',
        subtitle: 'You\'re making solid progress',
        gradient: ['#a855f7', '#9333ea']
      };
    } else {
      return {
        icon: Brain,
        color: '#3b82f6',
        message: 'Keep Learning!',
        subtitle: 'Practice makes perfect',
        gradient: ['#3b82f6', '#2563eb']
      };
    }
  }, [percentage]);

  useEffect(() => {
    const saveQuizProgress = async () => {
      try {
        await apiClient.post('/quizzes/progress', {
          quizId,
          score,
          totalQuestions,
        });
        console.log('Quiz progress saved successfully!');
      } catch (error) {
        console.error('Failed to save quiz progress:', error);
        Alert.alert('Error', 'Could not save your quiz results. Please check your connection.');
      }
    };

    saveQuizProgress();

    // Start animations
    Animated.sequence([
      // Fade in
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Scale in score
      Animated.spring(scaleAnimation, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Bounce animation for icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotate animation for high scores
    if (percentage >= 80) {
      Animated.loop(
        Animated.timing(rotateAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();
    }

    // Confetti animation for excellent scores
    if (percentage >= 90) {
      Animated.loop(
        Animated.timing(confettiAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [quizId, score, totalQuestions, percentage]);

  const IconComponent = getPerformanceData.icon;

  const bounceTransform = bounceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const rotateTransform = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const confettiTransform = confettiAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

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
        <FloatingIcon icon={TrendingUp} size={18} style={{ position: 'absolute', bottom: '30%', right: '10%' }} delay={6000} />
      </View>

      {/* Confetti Animation for high scores */}
      {percentage >= 90 && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {[...Array(8)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.confetti,
                {
                  left: Math.random() * width,
                  top: Math.random() * 200 + 100,
                  transform: [
                    { translateX: confettiTransform },
                    { 
                      rotate: rotateAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '720deg'],
                      })
                    }
                  ],
                  backgroundColor: ['#ffd700', '#22c55e', '#a855f7', '#3b82f6'][i % 4],
                }
              ]}
            />
          ))}
        </View>
      )}

      {/* Content Container - Positioned above tab bar */}
      <Animated.View style={[
        styles.contentContainer,
        { opacity: fadeAnimation }
      ]}>
        {/* Header */}
        <View style={styles.header}>
          <Animated.View style={[
            styles.iconContainer,
            {
              transform: [
                { translateY: bounceTransform },
                { rotate: rotateTransform },
              ]
            }
          ]}>
            <LinearGradient
              colors={getPerformanceData.gradient}
              style={styles.iconGradient}
            >
              <IconComponent color="white" size={40} />
            </LinearGradient>
          </Animated.View>
          
          <Text style={styles.headerTitle}>Quiz Complete!</Text>
          <Text style={styles.headerSubtitle}>Here's how you performed</Text>
        </View>

        {/* Score Container */}
        <Animated.View style={[
          { transform: [{ scale: scaleAnimation }] }
        ]}>
          <BlurView intensity={15} tint="dark" style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Your Score</Text>
            
            <View style={styles.scoreDisplay}>
              <Text style={[styles.score, { color: getPerformanceData.color }]}>
                {score}
              </Text>
              <Text style={styles.scoreDivider}>/</Text>
              <Text style={styles.totalScore}>{totalQuestions}</Text>
            </View>
            
            <View style={styles.percentageContainer}>
              <LinearGradient
                colors={getPerformanceData.gradient}
                style={styles.percentageBadge}
              >
                <Text style={styles.percentage}>{percentage}%</Text>
              </LinearGradient>
            </View>
          </BlurView>
        </Animated.View>

        {/* Performance Message */}
        <BlurView intensity={10} tint="dark" style={styles.messageContainer}>
          <Text style={styles.motivationTitle}>{getPerformanceData.message}</Text>
          <Text style={styles.motivationText}>{getPerformanceData.subtitle}</Text>
        </BlurView>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.reset({
            index: 0,
            routes: [{ name: 'MainApp' }],
          })}
        >
          <LinearGradient
            colors={['#a855f7', '#9333ea']}
            style={styles.actionButtonGradient}
          >
            <Home size={20} color="white" />
            <Text style={styles.actionButtonText}>Back to Dashboard</Text>
          </LinearGradient>
        </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 85, // Space for transparent tab bar
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    marginBottom: 24,
    width: '90%',
  },
  scoreLabel: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
    fontWeight: '500',
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  score: {
    fontSize: 64,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scoreDivider: {
    fontSize: 32,
    color: 'rgba(255,255,255,0.5)',
    marginHorizontal: 8,
    fontWeight: 'bold',
  },
  totalScore: {
    fontSize: 32,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: 'bold',
  },
  percentageContainer: {
    marginTop: 8,
  },
  percentageBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  percentage: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    marginBottom: 32,
    alignItems: 'center',
  },
  motivationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  motivationText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  actionButton: {
    width: '80%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default QuizResultScreen;