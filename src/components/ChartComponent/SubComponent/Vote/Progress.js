import React, { useEffect, useRef, useState } from 'react';
import { View, Animated } from 'react-native';
function Progress({ step, steps, height }) {
  const animatedValue = useRef(new Animated.Value(-1000)).current;
  const reActive = useRef(new Animated.Value(-1000)).current;
  const [width, setWidth] = useState(0);
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: reActive,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [])

  useEffect(() => {
    if (steps === 0) return
    reActive.setValue(- width + (width * step) / steps)
  }, [width, step])

  return (
    <View
      onLayout={e => {
        const newWidth = e.nativeEvent.layout.width;
        setWidth(newWidth)
      }}
      style={{
        height,
        backgroundColor: 'rgba(0,0,0,0.1)',
        overflow: 'hidden',
        borderRadius: height,
      }}>
      <Animated.View style={{
        height,
        width: '100%',
        backgroundColor: 'orange',
        borderRadius: height,
        position: 'absolute',
        left: 0,
        top: 0,
        transform: [{ translateX: animatedValue }]
      }} />
    </View>
  );
}

export default Progress;