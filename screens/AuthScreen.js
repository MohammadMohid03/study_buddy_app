import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  InteractionManager,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Brain, User, Lock, Mail, ArrowRight, Eye, EyeOff, BookOpen, Sparkles } from 'lucide-react-native';
import apiClient from '../api/axiosConfig';
import { saveToken } from '../utils/secureStore';
import { getErrorMessage } from '../utils/errorHandler';
import FloatingIcon from '../components/FloatingIcons';

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // We'll keep email simple for now as our backend doesn't use it
  // const [email, setEmail] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {

    Keyboard.dismiss();
    // Basic validation
    if (!username.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    try {
      const userData = { username, password };
      let response;
      if (isLogin) {
        response = await apiClient.post('/auth/login', userData);
        await saveToken(response.data.token);
         InteractionManager.runAfterInteractions(() => {
          navigation.replace('MainApp');
        });
      } else {
        response = await apiClient.post('/auth/signup', userData);
        InteractionManager.runAfterInteractions(() => {
          Alert.alert(
            'Signup Successful!',
            'Your account has been created. Please log in.',
            [{ text: 'OK', onPress: () => setIsLogin(true) }]
          );
        });
      }
    } catch (error) {
      Alert.alert(isLogin ? 'Login Failed' : 'Signup Failed', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- LAYER 1: BACKGROUND --- */}
      <LinearGradient
        colors={['#1e1b4b', '#4c1d95', '#be185d']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Fixed floating icons with better positioning */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <FloatingIcon icon={BookOpen} size={32} style={{ position: 'absolute', top: '20%', left: '8%' }} delay={0} />
        <FloatingIcon icon={Brain} size={28} style={{ position: 'absolute', top: '15%', right: '12%' }} delay={1000} />
        <FloatingIcon icon={BookOpen} size={30} style={{ position: 'absolute', bottom: '25%', left: '15%' }} delay={2000} />
        <FloatingIcon icon={Sparkles} size={26} style={{ position: 'absolute', bottom: '35%', right: '8%' }} delay={3000} />
      </View>

      {/* --- LAYER 2: FOREGROUND CONTENT (SCROLLABLE) --- */}
      <View style={styles.contentWrapper}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoider}
          enabled={Platform.OS === 'ios'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
          >
            {/* Logo and Title */}
            <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Brain color="white" size={36} />
            </View>
            <Text style={styles.title}>Study Buddy</Text>
            <Text style={styles.subtitle}>Your AI-powered learning companion</Text>
          </View>

          {/* Auth Form using BlurView */}
          <BlurView intensity={20} tint="dark" style={styles.formContainer}>            
            {/* Toggle Buttons */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                onPress={() => setIsLogin(true)}
                style={[styles.toggleButton, isLogin && styles.toggleButtonActive]}
              >
                <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsLogin(false)}
                style={[styles.toggleButton, !isLogin && styles.toggleButtonActive]}
              >
                <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            
            {/* Username */}
            <View style={styles.inputWrapper}>
              <User style={styles.inputIcon} color="rgba(255,255,255,0.5)" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
            
            {/* Password */}
            <View style={styles.inputWrapper}>
              <Lock style={styles.inputIcon} color="rgba(255,255,255,0.5)" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                {showPassword ? 
                  <EyeOff color="rgba(255,255,255,0.7)" size={20} /> :
                  <Eye color="rgba(255,255,255,0.7)" size={20} />
                }
              </TouchableOpacity>
            </View>
            
            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>{isLogin ? 'Login' : 'Create Account'}</Text>
                  <ArrowRight color="white" size={20} />
                </>
              )}
            </TouchableOpacity>

          </BlurView>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  keyboardAvoider: {
    width: '100%',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden', // Necessary for BlurView
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 32,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
  },
  toggleButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  toggleText: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#4c1d95',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 24,
  },
  inputIcon: {
    marginLeft: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    color: 'white',
    fontSize: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a855f7', // Purple-500
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default AuthScreen;