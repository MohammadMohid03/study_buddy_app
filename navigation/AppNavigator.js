import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import Screens
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import NoteEditorScreen from '../screens/NoteEditorScreen';
import NoteDetailScreen from '../screens/NoteDetailScreen';
import QuizScreen from '../screens/QuizScreen'; // <-- IMPORT
import QuizResultScreen from '../screens/QuizResultScreen'; // <-- IMPORT

// Import the Tab Navigator
import AppTabs from './AppTabs';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Screens available BEFORE login */}
        <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Create Account' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Log In' }} />
        
        {/* After login, we show the main app which contains the tabs */}
        <Stack.Screen 
          name="MainApp" 
          component={AppTabs} 
          options={{ headerShown: false }} // Hide the header for the tab screen
        />

        {/* Screens available AFTER login (pushed on top of the tabs) */}
        <Stack.Screen name="NoteEditor" component={NoteEditorScreen} options={{ title: 'Create Note' }} />
        <Stack.Screen name="NoteDetail" component={NoteDetailScreen} options={{ title: 'Note Details' }} />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Study Quiz' }} />
        <Stack.Screen name="QuizResult" component={QuizResultScreen} options={{ title: 'Quiz Results' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;