import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

const FloatingIcon = ({ icon: Icon, style, size, delay = 0 }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floatAnimation = Animated.sequence([
      Animated.timing(floatAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
        delay: delay,
      }),
      Animated.timing(floatAnim, {
        toValue: 0,
        duration: 3000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]);
    
    Animated.loop(floatAnimation).start();
  }, [floatAnim, delay]);
  
  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <Animated.View style={[style, { transform: [{ translateY }] }]}>
      <Icon color="rgba(255, 255, 255, 0.1)" size={size} strokeWidth={1} />
    </Animated.View>
  );
};

export default FloatingIcon;