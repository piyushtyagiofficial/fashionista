import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { useAuth } from '../AuthContext';
import HomeHub from '../components/HomeHub'
import MaskedView from '@react-native-masked-view/masked-view';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigation = useNavigation();
  const { cartProducts } = useAuth();

  // Simulated product fetch
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = {
          data: {
            products: [
              {
                id: 1,
                name: 'Classic Leather Jacket',
                price: 4999,
                image: 'https://picsum.photos/400/400?random=1',
                featured: true,
              },
              {
                id: 2,
                name: 'Velvet Evening Dress',
                price: 3499,
                image: 'https://picsum.photos/400/400?random=2',
                featured: true,
              },
            ],
          },
        };
        setFeaturedProducts(response.data.products);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const categories = [
    { name: 'New Arrivals', icon: 'sparkles', products: 87 },
    { name: 'Men', icon: 'man', products: 215 },
    { name: 'Women', icon: 'woman', products: 342 },
    { name: 'Accessories', icon: 'glasses', products: 156 },
  ];

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#121212', '#1C2526', '#2A2F31']}
        style={[styles.container, styles.loadingContainer]}
      >
        <LottieView
          source={{ uri: 'https://lottie.host/cd4d1dff-256b-461b-8b32-0cd291ff2e26/UZnRwRqeiq.lottie' }}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.loadingText}>Loading FashionHub...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#121212', '#1C2526', '#2A2F31']}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <MaskedView
            maskElement={
              <Text style={styles.headerTitle}>
                FASHIONISTA
              </Text>
            }>
            <LinearGradient
              colors={['#2ec6f3', '#81fbb8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: 30 }}>
              <Text style={[styles.headerTitle, { opacity: 0 }]}>FASHIONISTA</Text>
            </LinearGradient>
          </MaskedView>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => navigation.navigate('search')}>
              <Ionicons name="search" size={24} color="#E0E0E0" style={styles.headerIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('profile-page/cart')}>
              <View style={styles.cartContainer}>
                <Ionicons name="cart" size={24} color="#E0E0E0" />
                {cartProducts.length > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartProducts.length}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Banner */}
        <Animatable.View animation="fadeIn" duration={1000}>
          <TouchableOpacity
            style={styles.heroContainer}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('products')}
          >
            <Image
              source={{ uri: 'https://picsum.photos/800/400?random=3' }}
              style={styles.heroImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(18, 18, 18, 0.8)']}
              style={styles.heroGradient}
            />
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>WINTER COLLECTION 2025</Text>
              <Text style={styles.heroSubtitle}>Up to 50% Off Selected Items</Text>
              <TouchableOpacity
                style={styles.heroButton}
                onPress={() => navigation.navigate('products')}
              >
                <Text style={styles.heroButtonText}>SHOP NOW</Text>
                <Ionicons name="arrow-forward" size={16} color="#E0E0E0" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Animatable.View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Shop By Category</Text>
        <View style={styles.categoriesContainer}>
          {categories.map((item, index) => (
            <Animatable.View
              key={index}
              animation="fadeInUp"
              delay={index * 150}
              style={styles.categoryCard}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate('products')}
                style={styles.categoryButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#4A4A4A', '#3D3D3D']}
                  style={styles.categoryIcon}
                >
                  <Ionicons name={item.icon} size={24} color="#E0E0E0" />
                </LinearGradient>
                <Text style={styles.categoryName}>{item.name}</Text>
                <Text style={styles.categoryCount}>{item.products}+ Products</Text>
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </View>

        {/* Featured Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate('products')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredContainer}
        >
          {featuredProducts.slice(0, 6).map((product, index) => (
            <Animatable.View
              key={product.id}
              animation="fadeInRight"
              delay={index * 200}
              style={styles.productCard}
            >
              <TouchableOpacity
                activeOpacity={0.9}
              // onPress={() =>
              //   navigation.navigate('profile-page/product-detail', { productId: product.id })
              // }
              >
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>₹{product.price}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addToCart} activeOpacity={0.7}>
                <Ionicons name="add" size={20} color="#E0E0E0" />
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </ScrollView>
        <HomeHub />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 100,
    backgroundColor: '#000'
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 200,
    height: 200,
  },
  loadingText: {
    color: '#E0E0E0',
    fontSize: 18,
    marginTop: 20,
    fontFamily: 'Inter-Medium',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  headerIcon: {
    marginRight: 0,
  },
  cartContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#E0E0E0',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  heroContainer: {
    height: width * 0.6,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 25,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  heroTextContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  heroTitle: {
    color: '#E0E0E0',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontFamily: 'Inter-Bold',
  },
  heroSubtitle: {
    color: '#B0B0B0',
    fontSize: 16,
    marginBottom: 15,
    fontFamily: 'Inter-Regular',
  },
  heroButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  heroButtonText: {
    color: '#E0E0E0',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#E0E0E0',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  seeAll: {
    color: '#FF6B6B',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  categoryCard: {
    width: '48%',
    marginBottom: 15,
  },
  categoryButton: {
    backgroundColor: '#1C2526',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2F31',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryName: {
    color: '#E0E0E0',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
  categoryCount: {
    color: '#B0B0B0',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  featuredContainer: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 10,
  },
  productCard: {
    width: width * 0.6,
    backgroundColor: '#1C2526',
    borderRadius: 12,
    marginRight: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2F31',
  },
  productImage: {
    width: '100%',
    height: width * 0.6,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    fontFamily: 'Inter-SemiBold',
  },
  productPrice: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  addToCart: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: '#FF6B6B',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;