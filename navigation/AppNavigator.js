import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import Screens
import AuthScreen from '../screens/AuthScreen';
// We don't need SignupScreen and LoginScreen if AuthScreen handles both
// import SignupScreen from '../screens/SignupScreen';
// import LoginScreen from '../screens/LoginScreen';
import NoteEditorScreen from '../screens/NoteEditorScreen';
import NoteDetailScreen from '../screens/NoteDetailScreen';
import QuizScreen from '../screens/QuizScreen';
import QuizResultScreen from '../screens/QuizResultScreen';

// Import the Tab Navigator
import AppTabs from './AppTabs';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Auth"
        // --- THIS IS THE KEY ADDITION ---
        screenOptions={{
          // This makes the background of each screen transparent by default
          cardStyle: { backgroundColor: 'transparent' }, 
          // You might also want to control headers from here for consistency
          headerTintColor: 'white', // Sets the back button and title color
          headerStyle: { backgroundColor: '#1e1b4b' }, // A default header color
        }}
        // --- END OF ADDITION ---
      >
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen} 
          options={{ headerShown: false }} 
        />
        
        <Stack.Screen 
          name="MainApp" 
          component={AppTabs} 
          options={{ headerShown: false }} 
        />

        {/* 
          Now you can override screenOptions for specific screens.
          For example, if NoteEditor should have a different header.
        */}
        <Stack.Screen 
          name="NoteEditor" 
          component={NoteEditorScreen} 
          options={{ 
            title: 'Create Note',
            // Example of a custom header for this screen
            headerStyle: { backgroundColor: '#4c1d95' } 
          }} 
        />
        <Stack.Screen 
          name="NoteDetail" 
          component={NoteDetailScreen} 
          options={{ title: 'Note Details' }} 
        />
        <Stack.Screen 
          name="Quiz" 
          component={QuizScreen} 
          options={{ title: 'Study Quiz' }} 
        />
        <Stack.Screen 
          name="QuizResult" 
          component={QuizResultScreen} 
          options={{ title: 'Quiz Results' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;