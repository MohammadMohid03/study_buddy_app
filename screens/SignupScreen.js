import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import apiClient from '../api/axiosConfig'; // 1. IMPORT THE API CLIENT

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // For better loading feedback
  const [errors, setErrors] = useState({}); // 1. NEW STATE FOR ERRORS

  // 2. NEW VALIDATION FUNCTION
  const validateForm = () => {
    const newErrors = {};
    if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long.';
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }
    setErrors(newErrors);
    // Return true if there are no errors, false otherwise
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    // 3. RUN VALIDATION FIRST
    if (!validateForm()) {
      return; // Stop if the form is not valid
    }

    setLoading(true); // Start loading indicator
    try {
      const userData = { username, password };
      const response = await apiClient.post('/auth/signup', userData);

      Alert.alert(
        'Success!',
        `User "${response.data.username}" created successfully.`,
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
      Alert.alert('Signup Failed', errorMessage);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      {/* Username Input */}
      <CustomInput
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          if (errors.username) validateForm(); // Re-validate as user types
        }}
        placeholder="Enter a username"
        autoCapitalize="none"
        style={errors.username ? styles.errorInput : null} // Apply error style
      />
      {/* 4. DISPLAY THE ERROR MESSAGE */}
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

      {/* Password Input */}
      <CustomInput
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) validateForm(); // Re-validate as user types
        }}
        placeholder="Enter a password"
        secureTextEntry={true}
        style={errors.password ? styles.errorInput : null} // Apply error style
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      {/* Signup Button with Loading State */}
      <CustomButton 
        title={loading ? 'Creating Account...' : 'Sign Up'} 
        onPress={handleSignup} 
        disabled={loading}
      />

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
  rrorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 10,
  },
});

export default SignupScreen;