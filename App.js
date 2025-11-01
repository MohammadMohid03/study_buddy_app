import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar'; // 1. IMPORT StatusBar

export default function App() {
   return (
    <>
      {/* 2. ADD the StatusBar component */}
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <AppNavigator />
    </>
  );
}