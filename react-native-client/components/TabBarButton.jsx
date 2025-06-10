import { Pressable, View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { icons } from '../assets/icons'
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming 
} from 'react-native-reanimated'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const TabBarButton = ({ isFocused, label, routeName, color, onPress }) => {
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)

  useEffect(() => {
    scale.value = withTiming(isFocused ? 1.1 : 1, { duration: 150 })
    opacity.value = withTiming(isFocused ? 1 : 0.8, { duration: 150 })
  }, [isFocused])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value
  }))

  return (
    <AnimatedPressable 
      onPress={onPress}
      style={[styles.button, animatedStyle]}
    >
      <View style={styles.iconContainer}>
        {icons[routeName]({ color })}
      </View>
      <Text style={[styles.label, { color }]}>
        {label}
      </Text>
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 70, // Match tab bar height
  },
  iconContainer: {
    marginBottom: 4,
    // padding: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  }
})

export default TabBarButton