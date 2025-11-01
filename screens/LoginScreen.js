import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import apiClient from '../api/axiosConfig';
import { saveToken } from '../utils/secureStore';
import { getErrorMessage } from '../utils/errorHandler'; // <-- IMPORT OUR HANDLER

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username cannot be empty.';
    if (!password.trim()) newErrors.password = 'Password cannot be empty.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userData = { username, password };
      const response = await apiClient.post('/auth/login', userData);
      
      await saveToken(response.data.token);
      
      // We don't need the Alert on success, just navigate
      navigation.replace('MainApp');

    } catch (error) {
      const errorMessage = getErrorMessage(error); // <-- USE OUR HANDLER
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

      <CustomInput
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your username"
        autoCapitalize="none"
        style={errors.username ? styles.errorInput : null}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

      <CustomInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry={true}
        style={errors.password ? styles.errorInput : null}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <CustomButton 
        title={loading ? 'Logging In...' : 'Log In'} 
        onPress={handleLogin} 
        disabled={loading}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... styles are identical to SignupScreen
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  linkText: {
    color: '#007BFF',
    marginTop: 20,
    fontSize: 16,
  },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: '#333' },
  linkText: { color: '#007BFF', marginTop: 20, fontSize: 16 },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 10,
  },
});

export default LoginScreen;