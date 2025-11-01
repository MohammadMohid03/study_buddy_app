import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Brain, BookOpen, Sparkles, TrendingUp, Award, Calendar, Target } from 'lucide-react-native';
import apiClient from '../api/axiosConfig';
import FloatingIcon from '../components/FloatingIcons';

const ProgressScreen = () => {
  const [progressRecords, setProgressRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/quizzes/progress');
      setProgressRecords(response.data);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProgress();
    }, [])
  );

  const renderProgressItem = ({ item }) => {
    const percentage = Math.round((item.score / item.totalQuestions) * 100);
    const isGoodScore = percentage >= 80;
    const isGreatScore = percentage >= 90;
    
    return (
      <BlurView intensity={15} tint="dark" style={styles.itemContainer}>
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <View style={[
              styles.scoreIcon,
              { backgroundColor: isGreatScore ? 'rgba(34, 197, 94, 0.3)' : isGoodScore ? 'rgba(168, 85, 247, 0.3)' : 'rgba(251, 191, 36, 0.3)' }
            ]}>
              <Award 
                size={20} 
                color={isGreatScore ? '#22c55e' : isGoodScore ? '#a855f7' : '#fbbf24'} 
              />
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle}>
                {item.quiz ? item.quiz.note.title : 'Deleted Note'}
              </Text>
              <View style={styles.dateContainer}>
                <Calendar size={14} color="rgba(255,255,255,0.6)" />
                <Text style={styles.itemDate}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.scoreContainer}>
            <Text style={[
              styles.score, 
              isGreatScore ? styles.greatScore : isGoodScore ? styles.goodScore : styles.okScore
            ]}>
              {percentage}%
            </Text>
            <Text style={styles.scoreLabel}>
              {item.score}/{item.totalQuestions}
            </Text>
          </View>
        </View>
      </BlurView>
    );
  };

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
          <FloatingIcon icon={TrendingUp} size={22} style={{ position: 'absolute', bottom: '40%', left: '20%' }} delay={3000} />
        </View>

        <View style={styles.centered}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Loading Progress...</Text>
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
        <FloatingIcon icon={TrendingUp} size={22} style={{ position: 'absolute', bottom: '45%', left: '15%' }} delay={4000} />
        <FloatingIcon icon={Target} size={18} style={{ position: 'absolute', bottom: '30%', right: '10%' }} delay={6000} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <TrendingUp color="white" size={28} />
        </View>
        <Text style={styles.title}>My Progress</Text>
        <Text style={styles.subtitle}>Track your learning journey</Text>
      </View>

      {/* Progress List - Positioned above tab bar */}
      <View style={styles.contentContainer}>
        <FlatList
          data={progressRecords}
          renderItem={renderProgressItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <BlurView intensity={15} tint="dark" style={styles.emptyContainer}>
              <TrendingUp color="rgba(255,255,255,0.7)" size={48} />
              <Text style={styles.emptyTitle}>No Progress Yet</Text>
              <Text style={styles.emptyText}>
                Take a quiz to see your progress and track your learning journey!
              </Text>
            </BlurView>
          }
        />
      </View>
    </View>
  );
};

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
    marginBottom: 65, // Space for transparent tab bar
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  itemContainer: {
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  itemContent: {
    padding: 20,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDate: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 4,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  scoreLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  greatScore: { 
    color: '#22c55e',
    textShadowColor: 'rgba(34, 197, 94, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  goodScore: { 
    color: '#a855f7',
    textShadowColor: 'rgba(168, 85, 247, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  okScore: { 
    color: '#fbbf24',
    textShadowColor: 'rgba(251, 191, 36, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  emptyContainer: {
    padding: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    marginTop: 40,
    overflow: 'hidden',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
});

export default ProgressScreen;