import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Brain, BookOpen, Sparkles, Send } from 'lucide-react-native';
import apiClient from '../api/axiosConfig';
import FloatingIcon from '../components/FloatingIcons';

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
      const errorMessage = { 
        id: (Date.now() + 1).toString(), 
        text: "Sorry, I couldn't connect. Please try again.", 
        sender: 'ai', 
        isError: true 
      };
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
      {item.sender === 'user' ? (
        <Text style={styles.userText}>{item.text}</Text>
      ) : (
        <BlurView intensity={15} tint="dark" style={styles.aiMessageContent}>
          <Text style={styles.aiText}>{item.text}</Text>
        </BlurView>
      )}
    </View>
  );

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
        <FloatingIcon icon={Brain} size={18} style={{ position: 'absolute', bottom: '30%', right: '10%' }} delay={6000} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Brain color="white" size={28} />
        </View>
        <Text style={styles.title}>AI Tutor</Text>
        <Text style={styles.subtitle}>Your intelligent learning companion</Text>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={85}
      >
        {/* Messages List */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messageList}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 110 }}
          inverted
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <BlurView intensity={15} tint="dark" style={styles.welcomeCard}>
                <Brain color="rgba(255,255,255,0.7)" size={48} />
                <Text style={styles.welcomeTitle}>Welcome to AI Tutor!</Text>
                <Text style={styles.welcomeText}>
                  Ask me anything about your studies. I'm here to help you learn and understand better.
                </Text>
              </BlurView>
            </View>
          }
        />

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <BlurView intensity={10} tint="dark" style={styles.loadingBubble}>
              <ActivityIndicator size="small" color="white" />
              <Text style={styles.loadingText}>AI is thinking...</Text>
            </BlurView>
          </View>
        )}

        {/* Input Container - Positioned above tab bar */}
        <BlurView intensity={20} tint="dark" style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask your AI Tutor..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              editable={!loading}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              onPress={handleSend} 
              style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]} 
              disabled={!input.trim() || loading}
            >
              <LinearGradient
                colors={(!input.trim() || loading) ? ['rgba(168, 85, 247, 0.5)', 'rgba(168, 85, 247, 0.3)'] : ['#a855f7', '#9333ea']}
                style={styles.sendButtonGradient}
              >
                <Send size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
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
  chatContainer: {
    flex: 1,
    marginBottom: 65, // Space for transparent tab bar
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageListContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  aiBubble: {
    alignSelf: 'flex-start',
  },
  errorBubble: {},
  userText: {
    color: 'white',
    fontSize: 16,
    padding: 16,
    backgroundColor: '#a855f7',
    borderRadius: 20,
    borderBottomRightRadius: 4,
    overflow: 'hidden',
  },
  aiMessageContent: {
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  aiText: {
    color: 'white',
    fontSize: 16,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    //transform: [{ scaleY: -1 }], // Flip back since FlatList is inverted
  },
  welcomeCard: {
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    maxWidth: 300,
    overflow: 'hidden',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 8,
    fontSize: 14,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: 16,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AITutorScreen;