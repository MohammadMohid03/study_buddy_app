import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import DashboardScreen from '../screens/DashboardScreen';
import AITutorScreen from '../screens/AITutorScreen';
import ProgressScreen from '../screens/ProgressScreen';
import { Brain, BookOpen, TrendingUp } from 'lucide-react-native';

const Tab = createBottomTabNavigator();



const CustomTabBarIcon = ({ focused, Icon, size = 22 }) => {
  return (
    <View style={[
      styles.iconContainer,
      focused && styles.iconContainerFocused
    ]}>
      {focused && (
        <View style={styles.iconBackground}>
          <LinearGradient
            colors={['rgba(168, 85, 247, 0.4)', 'rgba(168, 85, 247, 0.2)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </View>
      )}
      <Icon 
        size={size} 
        color={focused ? 'white' : 'rgba(255,255,255,0.7)'} 
        strokeWidth={focused ? 2.5 : 2}
      />
    </View>
  );
};

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          if (route.name === 'Notes') {
            return <CustomTabBarIcon focused={focused} Icon={BookOpen} size={size} />;
          } else if (route.name === 'AI Tutor') {
            return <CustomTabBarIcon focused={focused} Icon={Brain} size={size} />;
          } else if (route.name === 'Progress') {
            return <CustomTabBarIcon focused={focused} Icon={TrendingUp} size={size} />;
          }
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 65,
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          elevation: 0,
          paddingBottom: 8,
          paddingTop: 8,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
          textShadowColor: 'rgba(0,0,0,0.8)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 3,
        },
        tabBarItemStyle: {
          paddingVertical: 3, // Reduced from 5
        },
        headerShown: true,
        headerTransparent: true,
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          color: 'white',
          fontWeight: 'bold',
          fontSize: 20,
          textShadowColor: 'rgba(0,0,0,0.8)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 3,
        },

      })}
    >
      <Tab.Screen 
        name="Notes" 
        component={DashboardScreen} 
        options={{ 
          title: 'My Study Notes',
          tabBarLabel: 'Notes'
        }} 
      />
      <Tab.Screen 
        name="AI Tutor" 
        component={AITutorScreen}
        options={{
          tabBarLabel: 'AI Tutor'
        }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen} 
        options={{ 
          title: 'My Progress',
          tabBarLabel: 'Progress'
        }} 
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 42,  // Reduced from 50
    height: 32, // Reduced from 40
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Reduced from 12
    position: 'relative',
  },
  iconContainerFocused: {
    transform: [{ scale: 1.05 }], // Reduced from 1.1
  },
  iconBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
});

export default AppTabs;