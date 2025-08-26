import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import apiClient from '../api/axiosConfig'; // 1. IMPORT THE API CLIENT

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 2. UPDATE THE HANDLESIGNUP FUNCTION
  const handleSignup = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter both username and password.');
      return;
    }

    try {
      // The data we want to send to the server
      const userData = {
        username: username,
        password: password,
      };

      // Make the POST request to the '/auth/signup' endpoint
      const response = await apiClient.post('/auth/signup', userData);

      // If the request is successful (status 201)
      console.log('Signup success:', response.data);
      Alert.alert(
        'Success!',
        `User "${response.data.username}" created successfully.`,
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }] // Navigate to Login on success
      );

    } catch (error) {
      // If the server responds with an error
      console.error('Signup error:', error.response ? error.response.data : error.message);
      
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
      Alert.alert('Signup Failed', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      <CustomInput
        value={username}
        onChangeText={setUsername}
        placeholder="Enter a username"
        autoCapitalize="none"
      />
      <CustomInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter a password"
        secureTextEntry={true}
      />
      <CustomButton title="Sign Up" onPress={handleSignup} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... styles remain the same
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

export default SignupScreen;