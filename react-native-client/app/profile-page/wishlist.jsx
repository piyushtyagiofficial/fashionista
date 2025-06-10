import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Animated,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../AuthContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const BASE_URL = 'https://fashionista-red.vercel.app/api/auth';

const WishlistScreen = () => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { isLogin, token } = useAuth();
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Fade in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLogin || !token) {
      Alert.alert('Authentication Required', 'Please log in to view your wishlist', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
      setIsLoading(false);
    }
  }, [isLogin, token, navigation]);

  // Fetch wishlist data
  const fetchWishlist = useCallback(async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      if (response.data.success) {
        setWishlist(response.data.wishlist || []);
      } else {
        throw new Error('Unable to load wishlist');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load wishlist';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (isLogin && token) {
      fetchWishlist();
    }
  }, [isLogin, token, fetchWishlist]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemoveFromWishlist = useCallback(
    async (productId) => {
      try {
        const response = await axios.delete(`${BASE_URL}/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setWishlist((prev) => prev.filter((item) => item._id !== productId));
        }
      } catch (err) {
        Alert.alert('Error', err.response?.data?.message || 'Failed to remove item');
      }
    },
    [token]
  );

  const handleMoveToCart = useCallback((product) => {
    navigation.navigate('profile-page/cart', { product });
  }, [navigation]);

  const renderWishlistItem = useCallback(
    ({ item, index }) => (
      <Animated.View 
        style={[
          styles.card,
          { 
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity 
          onPress={() => navigation.navigate('profile-page/product-detail', { product: item })}
          activeOpacity={0.8}
          style={styles.cardTouchable}
        >
          <Image
            source={{ uri: item.images?.[0] || 'https://via.placeholder.com/100' }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.info}>
            <View style={styles.textContainer}>
              <Text style={styles.name} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.brand}>{item.brand}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.salePrice}>${item.salePrice}</Text>
                {item.price !== item.salePrice && (
                  <Text style={styles.originalPrice}>${item.price}</Text>
                )}
              </View>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.moveToCartButton}
                onPress={() => handleMoveToCart(item)}
              >
                <MaterialIcons name="add-shopping-cart" size={18} color="#FFFFFF" />
                <Text style={styles.moveToCartButtonText}>Add to Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFromWishlist(item._id)}
              >
                <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    ),
    [fadeAnim, handleRemoveFromWishlist, handleMoveToCart, navigation]
  );

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#0f0c29', '#302b63', '#24243e']}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading your wishlist...</Text>
      </LinearGradient>
    );
  }

  if (!isLogin || !token) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>My Wishlist</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {error ? (
        <View style={styles.centered}>
          <MaterialIcons name="error-outline" size={48} color="#FF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchWishlist}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : wishlist.length === 0 ? (
        <View style={styles.centered}>
          <MaterialIcons name="favorite-border" size={64} color="#BB86FC" />
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtext}>Start adding items you love!</Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => navigation.navigate('products')}
          >
            <Text style={styles.shopNowButtonText}>Explore Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#BB86FC']}
              tintColor="#BB86FC"
              progressBackgroundColor="#1E1E1E"
            />
          }
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 48,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'sans-serif-condensed',
    letterSpacing: 1,
  },
  refreshButton: {
    backgroundColor: 'rgba(187, 134, 252, 0.2)',
    padding: 10,
    borderRadius: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(30, 30, 46, 0.8)',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardTouchable: {
    flexDirection: 'row',
    padding: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(187, 134, 252, 0.3)',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  brand: {
    fontSize: 14,
    color: '#BBBBBB',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  salePrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4CAF50',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#888888',
    textDecorationLine: 'line-through',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  moveToCartButton: {
    backgroundColor: '#BB86FC',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  moveToCartButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  removeButton: {
    backgroundColor: '#D32F2F',
    padding: 10,
    borderRadius: 8,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BBBBBB',
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  shopNowButton: {
    backgroundColor: '#BB86FC',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  shopNowButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4444',
    textAlign: 'center',
    marginVertical: 16,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#BB86FC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WishlistScreen;