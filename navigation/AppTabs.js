import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import AITutorScreen from '../screens/AITutorScreen';
import ProgressScreen from '../screens/ProgressScreen'; // <-- 1. IMPORT
import { Ionicons } from '@expo/vector-icons'; 

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Notes') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'AI Tutor') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Progress') { // <-- 2. ADD ICON LOGIC
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Notes" component={DashboardScreen} options={{ title: 'My Study Notes' }} />
      <Tab.Screen name="AI Tutor" component={AITutorScreen} />
      {/* 3. ADD THE SCREEN TO THE TAB NAVIGATOR */}
      <Tab.Screen name="Progress" component={ProgressScreen} options={{ title: 'My Progress' }} />
    </Tab.Navigator>
  );
};

export default AppTabs;