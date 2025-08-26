import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../api/axiosConfig';

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
    return (
      <View style={styles.itemContainer}>
        <View>
          <Text style={styles.itemTitle}>
            Quiz on: {item.quiz ? item.quiz.note.title : 'Deleted Note'}
          </Text>
          <Text style={styles.itemDate}>
            Taken on: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <Text style={[styles.score, percentage >= 80 ? styles.goodScore : styles.okScore]}>
          {percentage}%
        </Text>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" style={{ flex: 1 }} />;
  }

  return (
    <FlatList
      data={progressRecords}
      renderItem={renderProgressItem}
      keyExtractor={(item) => item._id}
      style={styles.container}
      ListHeaderComponent={<Text style={styles.header}>Quiz History</Text>}
      ListEmptyComponent={<Text style={styles.emptyText}>No quiz history found. Take a quiz to see your progress!</Text>}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { fontSize: 24, fontWeight: 'bold', padding: 20, paddingBottom: 10 },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
  },
  itemTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  itemDate: { fontSize: 14, color: '#666' },
  score: { fontSize: 22, fontWeight: 'bold' },
  goodScore: { color: '#28a745' },
  okScore: { color: '#ffc107' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
});

export default ProgressScreen;