import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import apiClient from '../api/axiosConfig';
import { Ionicons } from '@expo/vector-icons';

const AITutorScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [userMessage, ...prev]);
    setInput('');
    setLoading(true);

    try {
      const response = await apiClient.post('/ai/chat', { message: input });
      const aiMessage = { id: (Date.now() + 1).toString(), text: response.data.reply, sender: 'ai' };
      setMessages(prev => [aiMessage, ...prev]);
    } catch (error) {
      console.error("AI chat error:", error);
      const errorMessage = { id: (Date.now() + 1).toString(), text: "Sorry, I couldn't connect. Please try again.", sender: 'ai', isError: true };
      setMessages(prev => [errorMessage, ...prev]);
    } finally {
      setLoading(false);
    }
  };
  
  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageBubble, 
      item.sender === 'user' ? styles.userBubble : styles.aiBubble,
      item.isError && styles.errorBubble
    ]}>
      <Text style={item.sender === 'user' ? styles.userText : styles.aiText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        inverted // This makes the list start from the bottom
      />
      {loading && <ActivityIndicator style={styles.loader} color="#007BFF" />}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask your AI Tutor..."
          editable={!loading}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={loading}>
          <Ionicons name="arrow-up-circle" size={36} color="#007BFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f7' },
  messageList: { padding: 10 },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  input: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15, backgroundColor: '#f7f7f7' },
  sendButton: { marginLeft: 10, justifyContent: 'center' },
  messageBubble: { maxWidth: '80%', padding: 15, borderRadius: 20, marginBottom: 10 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#007BFF' },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#E5E5EA' },
  errorBubble: { backgroundColor: '#ffdddd' },
  userText: { color: '#fff' },
  aiText: { color: '#000' },
  loader: { paddingBottom: 10 }
});

export default AITutorScreen;