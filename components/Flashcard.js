import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Flashcard = ({ front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <TouchableOpacity onPress={handleFlip} activeOpacity={0.7}>
      <View style={[styles.card, isFlipped ? styles.cardBack : styles.cardFront]}>
        <Text style={styles.cardText}>
          {isFlipped ? back : front}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 200,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardFront: {
    backgroundColor: '#FFFFFF',
  },
  cardBack: {
    backgroundColor: '#e0f7fa', // A light blue to indicate the back
  },
  cardText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Flashcard;