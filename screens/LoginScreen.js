import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import apiClient from '../api/axiosConfig';
import { saveToken } from '../utils/secureStore';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter both username and password.');
      return;
    }

    try {
      // THIS IS THE LINE TO ADD
      const userData = {
        username: username,
        password: password,
      };

    // ... api call ...
    const response = await apiClient.post('/auth/login', userData);

    console.log('Login success:', response.data);
    
    // 2. SAVE THE TOKEN
    await saveToken(response.data.token);
    
    Alert.alert('Login Successful!', `Welcome back, ${response.data.username}!`);
    
    navigation.navigate('MainApp');

  } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
      Alert.alert('Login Failed', errorMessage);
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
      />

      <CustomInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry={true}
      />

      <CustomButton title="Log In" onPress={handleLogin} />

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
});

export default LoginScreen;