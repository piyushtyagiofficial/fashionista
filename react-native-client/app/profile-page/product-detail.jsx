import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../../AuthContext';
import { ToastAndroid } from 'react-native';
import LottieView from 'lottie-react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

const BASE_URL = 'https://fashionista-red.vercel.app';

export default function ProductDetailScreen({ navigation }) {
    const { cartProducts, setCartProducts, token, isLogin } = useAuth();
    const route = useRoute();
    const { product } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.size || '');
    const [selectedColor, setSelectedColor] = useState(product.colors[0]?.color || '');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    useEffect(() => {
        const checkWishlistStatus = async () => {
            if (!token) return;

            try {
                const response = await axios.get(
                    `${BASE_URL}/api/auth/wishlist/check/${product._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setIsWishlisted(response.data.isInWishlist);
            } catch (error) {
                console.error('Error checking wishlist status:', error);
                if (error.response?.status === 401) {
                    // Token might be expired, handle accordingly
                    ToastAndroid.show('Session expired. Please login again.', ToastAndroid.SHORT);
                }
            }
        };

        checkWishlistStatus();
        setTimeout(() => setIsLoading(false), 2000);
    }, [product._id, token]);

    const handleAddToCart = (product) => {
        const cartItemId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const newProduct = {
            ...product,
            image: product.images[0],
            quantity: quantity,
            selectedSize: selectedSize,
            selectedColor: selectedColor,
            cartItemId,
        };

        const existingProductIndex = cartProducts.findIndex(
            (item) =>
                item._id === newProduct._id &&
                item.selectedSize === newProduct.selectedSize &&
                item.selectedColor === newProduct.selectedColor
        );

        if (existingProductIndex === -1) {
            setCartProducts((prev) => [...prev, newProduct]);
        } else {
            const updatedCart = [...cartProducts];
            updatedCart[existingProductIndex].quantity += quantity;
            setCartProducts(updatedCart);
        }

        ToastAndroid.show('Added to cart successfully!', ToastAndroid.SHORT);
    };

    const handleWishlistAction = async () => {
        if (!isLogin) {
            ToastAndroid.show('Please login to manage wishlist', ToastAndroid.SHORT);
            navigation.navigate('Login'); // Navigate to login screen
            return;
        }

        setWishlistLoading(true);
        try {
            if (isWishlisted) {
                await axios.delete(
                    `${BASE_URL}/api/auth/wishlist/${product._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                ToastAndroid.show('Removed from wishlist', ToastAndroid.SHORT);
            } else {
                await axios.post(
                    `${BASE_URL}/api/auth/wishlist`,
                    { productId: product._id },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                ToastAndroid.show('Added to wishlist', ToastAndroid.SHORT);
            }
            setIsWishlisted(!isWishlisted);
        } catch (error) {
            console.error('Wishlist error:', error);
            ToastAndroid.show(
                error.response?.data?.message || 'Wishlist operation failed',
                ToastAndroid.SHORT
            );
            if (error.response?.status === 401) {
                // Token expired or invalid
                ToastAndroid.show('Session expired. Please login again.', ToastAndroid.SHORT);
            }
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleQuantityChange = (action) => {
        if (action === 'increment') {
            setQuantity(quantity + 1);
        } else if (action === 'decrement' && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const getStockStatus = () => {
        const selectedSizeObj = product.sizes.find(s => s.size === selectedSize);
        return selectedSizeObj ? selectedSizeObj.countInStock > 0 : false;
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <LottieView
                    source={{ uri: 'https://lottie.host/cd4d1dff-256b-461b-8b32-0cd291ff2e26/UZnRwRqeiq.lottie' }}
                    autoPlay
                    loop
                    style={styles.lottie}
                />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.productContainer}>
                {/* Product Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: product.images[0] }}
                        style={styles.mainImage}
                        resizeMode="cover"
                    />
                    <TouchableOpacity
                        style={styles.wishlistButton}
                        onPress={handleWishlistAction}
                        disabled={wishlistLoading}
                    >
                        {wishlistLoading ? (
                            <ActivityIndicator size="small" color="#FF6B81" />
                        ) : (
                            <>
                                <Ionicons
                                    name={isWishlisted ? 'heart' : 'heart-outline'}
                                    size={24}
                                    color={isWishlisted ? '#FF6B81' : '#FFFFFF'}
                                />
                                {isWishlisted && (
                                    <Text style={styles.wishlistText}>Saved</Text>
                                )}
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Product Details */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>{product.name}</Text>

                    {/* Rating */}
                    <View style={styles.ratingContainer}>
                        {[...Array(Math.floor(product.rating))].map((_, index) => (
                            <FontAwesome key={index} name="star" size={16} color="#FFD700" style={styles.starIcon} />
                        ))}
                        {product.rating % 1 !== 0 && (
                            <FontAwesome name="star-half-o" size={16} color="#FFD700" style={styles.starIcon} />
                        )}
                        {[...Array(5 - Math.ceil(product.rating))].map((_, index) => (
                            <FontAwesome key={index} name="star-o" size={16} color="#FFD700" style={styles.starIcon} />
                        ))}
                        <Text style={styles.ratingText}>({product.numReviews} reviews)</Text>
                    </View>

                    {/* Price */}
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>${product.salePrice.toFixed(2)}</Text>
                        <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
                    </View>

                    {/* Description */}
                    <Text style={styles.description}>
                        {product.description}{'\n'}
                        Brand: {product.brand}{'\n'}
                        Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}{'\n'}
                        Subcategory: {product.subcategory}
                    </Text>

                    {/* Size Selector */}
                    <Text style={styles.sectionTitle}>Select Size</Text>
                    <View style={styles.selectorContainer}>
                        {product.sizes.map((sizeObj) => (
                            <TouchableOpacity
                                key={sizeObj.size}
                                style={[
                                    styles.selectorButton,
                                    selectedSize === sizeObj.size && styles.selectedButton
                                ]}
                                onPress={() => setSelectedSize(sizeObj.size)}
                            >
                                <Text style={[
                                    styles.selectorText,
                                    selectedSize === sizeObj.size && styles.selectedText
                                ]}>
                                    {sizeObj.size}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Color Selector */}
                    <Text style={styles.sectionTitle}>Select Color</Text>
                    <View style={styles.selectorContainer}>
                        {product.colors.map((colorObj) => (
                            <TouchableOpacity
                                key={colorObj.color}
                                style={[
                                    styles.colorButton,
                                    { backgroundColor: colorObj.colorCode },
                                    selectedColor === colorObj.color && styles.selectedColorButton
                                ]}
                                onPress={() => setSelectedColor(colorObj.color)}
                            />
                        ))}
                    </View>

                    {/* Quantity Selector */}
                    <Text style={styles.sectionTitle}>Quantity</Text>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => handleQuantityChange('decrement')}
                            disabled={quantity === 1}
                        >
                            <Ionicons name="remove" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => handleQuantityChange('increment')}
                        >
                            <Ionicons name="add" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Stock Status */}
                    <Text style={styles.stockStatus}>
                        {getStockStatus() ? 'In Stock' : 'Out of Stock'}
                    </Text>

                    {/* Action Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.cartButton,
                                { opacity: getStockStatus() ? 1 : 0.5 }
                            ]}
                            onPress={() => getStockStatus() && handleAddToCart(product)}
                            disabled={!getStockStatus()}
                        >
                            <Text style={styles.buttonText}>Add to Cart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.buyButton,
                                { opacity: getStockStatus() ? 1 : 0.5 }
                            ]}
                            disabled={!getStockStatus()}
                        >
                            <Text style={styles.buttonText}>Buy Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Reviews Section */}
            <View style={styles.reviewsContainer}>
                <Text style={styles.reviewsTitle}>Customer Reviews</Text>
                <View style={styles.reviewCard}>
                    <View style={styles.userContainer}>
                        <View style={styles.avatar} />
                        <View>
                            <Text style={styles.userName}>User#1</Text>
                            <Text style={styles.reviewDate}>6/6/2025</Text>
                        </View>
                    </View>
                    <View style={styles.reviewRating}>
                        {[...Array(5)].map((_, index) => (
                            <FontAwesome key={index} name="star" size={14} color="#FFD700" style={styles.starIcon} />
                        ))}
                    </View>
                    <Text style={styles.reviewText}>Amazing product, highly recommend!</Text>
                </View>
                <TouchableOpacity style={styles.writeReviewButton}>
                    <Text style={styles.writeReviewText}>Write a Review </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D',
        padding: 16,
        paddingTop: 45,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0D0D0D',
    },
    lottie: {
        width: 120,
        height: 120,
    },
    productContainer: {
        flexDirection: 'column',
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#BB86FC',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    imageContainer: {
        width: '100%',
        marginBottom: 16,
        position: 'relative',
    },
    mainImage: {
        width: '100%',
        height: 300,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333333',
    },
    wishlistButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#2C2C2C',
        borderRadius: 20,
        padding: 8,
        shadowColor: '#BB86FC',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    wishlistText: {
        color: '#FF6B81',
        fontSize: 12,
        marginLeft: 4,
        fontWeight: 'bold',
    },
    detailsContainer: {
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    starIcon: {
        marginRight: 2,
    },
    ratingText: {
        color: '#AAAAAA',
        fontSize: 14,
        marginLeft: 4,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FF6B81',
        marginRight: 10,
    },
    originalPrice: {
        fontSize: 16,
        color: '#555555',
        textDecorationLine: 'line-through',
    },
    description: {
        fontSize: 14,
        color: '#CCCCCC',
        marginBottom: 16,
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#E0E0E0',
        marginBottom: 10,
    },
    selectorContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    selectorButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#2C2C2C',
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    selectedButton: {
        backgroundColor: '#BB86FC',
        borderColor: '#BB86FC',
    },
    selectorText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    selectedText: {
        color: '#000000',
        fontWeight: 'bold',
    },
    colorButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 10,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#444',
    },
    selectedColorButton: {
        borderColor: '#BB86FC',
        transform: [{ scale: 1.1 }],
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    quantityButton: {
        backgroundColor: '#2C2C2C',
        padding: 8,
        borderRadius: 8,
        shadowColor: '#BB86FC',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    quantityText: {
        fontSize: 16,
        color: '#FFFFFF',
        marginHorizontal: 20,
    },
    stockStatus: {
        fontSize: 14,
        color: '#FF6B81',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cartButton: {
        backgroundColor: '#BB86FC',
        paddingVertical: 12,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
        elevation: 4,
    },
    buyButton: {
        backgroundColor: '#03DAC6',
        paddingVertical: 12,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
        elevation: 4,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    reviewsContainer: {
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 16,
        marginBottom: 150,
        shadowColor: '#03DAC6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    reviewsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    reviewCard: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#BB86FC',
        marginRight: 10,
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    reviewDate: {
        fontSize: 12,
        color: '#AAAAAA',
    },
    reviewRating: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    reviewText: {
        fontSize: 14,
        color: '#CCCCCC',
    },
    writeReviewButton: {
        backgroundColor: '#BB86FC',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    writeReviewText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
});