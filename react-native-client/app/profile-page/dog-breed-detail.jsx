import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const WishlistScreen = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Fetch wishlist data
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get('http://your-backend-url/api/auth/wishlist', {
          headers: {
            Authorization: `Bearer ${yourAuthToken}`, // Replace with actual token
          },
        });
        setWishlist(response.data.wishlist); // Full product details from populate
        setLoading(false);
      } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'Failed to fetch wishlist');
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const response = await axios.delete(`http://your-backend-url/api/auth/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${yourAuthToken}`, // Replace with actual token
        },
      });
      setWishlist(wishlist.filter((item) => item._id !== productId));
      Alert.alert('Success', response.data.message);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to remove from wishlist');
    }
  };

  const renderWishlistItem = ({ item }) => (
    <View style={styles.wishlistCard}>
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.salePrice}>${item.salePrice}</Text>
          {item.price !== item.salePrice && (
            <Text style={styles.originalPrice}>${item.price}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromWishlist(item._id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Wishlist</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('ProductList')} // Assumes a ProductList screen exists
      >
        <Text style={styles.addButtonText}>Add More Items</Text>
      </TouchableOpacity>
      {wishlist.length === 0 ? (
        <Text style={styles.emptyText}>Your wishlist is empty</Text>
      ) : (
        <FlatList
          data={wishlist}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#6200EA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
  wishlistCard: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  productBrand: {
    fontSize: 14,
    color: '#BBBBBB',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 14,
    color: '#888888',
    textDecorationLine: 'line-through',
  },
  removeButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 16,
    color: '#BBBBBB',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default WishlistScreen;