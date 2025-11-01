import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur'; // 1. Import BlurView

const Flashcard = ({ front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <TouchableOpacity onPress={handleFlip} activeOpacity={0.8}>
      {/* 2. We wrap the card in a BlurView for the glass effect */}
      <BlurView intensity={25} tint="dark" style={styles.card}>
        <Text style={styles.cardText}>
          {isFlipped ? back : front}
        </Text>
        <Text style={styles.flipIndicator}>
          {isFlipped ? 'Tap to see front' : 'Tap to see back'}
        </Text>
      </BlurView>
    </TouchableOpacity>
  );
};

// 3. Update the styles for the new theme
const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 200,
    borderRadius: 20, // A more modern, rounded look
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    // These next two lines are crucial for the glass effect
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white', // Text is now white to be visible on the dark background
  },
  flipIndicator: {
    position: 'absolute',
    bottom: 15,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

export default Flashcard;