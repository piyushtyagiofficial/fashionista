import { View, StyleSheet } from 'react-native'
import React from 'react'
import TabBarButton from './TabBarButton'

const noRoute = ['_sitemap', '(tabs)', 'login-singup/login', 'login-singup/signup', '+not-found', 'profile-page/wallet', 'profile-page/dog-breed-detail', 'profile-page/product-detail', 'Navigation', 'profile-page/cart', "profile-page/wishlist", "profile-page/check-out", "profile-page/about-me", "home-pages/adoption-form"]

const TabBar = ({ state, descriptors, navigation }) => {
  const primaryColor = '#7C3AED'; // Purple-600
  const inactiveColor = '#9CA3AF'; // Gray-400
  
  return (
    <View style={styles.container}>
      <View style={styles.tabbar}>
        {state.routes.map((route, index) => {
          if (noRoute.includes(route.name)) return null;
          
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TabBarButton
              key={route.name}
              onPress={onPress}
              isFocused={isFocused}
              routeName={route.name}
              color={isFocused ? primaryColor : inactiveColor}
              label={label}
            />
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 10,
  },
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FBFBFB', // Soft off-white background
    width: '90%',
    height: 70, // Keeping your original height
    borderRadius: 24,
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    // Soft border
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  }
})

export default TabBar