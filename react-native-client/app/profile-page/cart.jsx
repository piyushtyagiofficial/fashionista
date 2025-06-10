import React, { useState, useEffect } from "react";
import {
    View, Text, Image, FlatList, TouchableOpacity,
    StyleSheet, ToastAndroid, Modal,
    Dimensions
} from "react-native";
import { ProgressBar } from "react-native-paper";
import { useAuth } from "../../AuthContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get('window');

const ShoppingCart = () => {
    const navigation = useNavigation();
    const { cartProducts, setCartProducts, setCartAmount } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleIncrement = (cartItemId) => {
        setCartProducts(cartProducts.map(item =>
            item.cartItemId === cartItemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
        ));
    };

    const handleDecrement = (cartItemId) => {
        setCartProducts(cartProducts.map(item =>
            item.cartItemId === cartItemId
                ? { ...item, quantity: item.quantity - 1 }
                : item
        ).filter(item => item.quantity > 0));
    };

    const handleDelete = (cartItemId) => {
        setCartProducts(cartProducts.filter(item => item.cartItemId !== cartItemId));
        ToastAndroid.show('Removed From Cart!', ToastAndroid.SHORT);
    };

    const subtotal = cartProducts.reduce((sum, item) => sum + item.salePrice * item.quantity, 0); // Use salePrice
    const freeShippingThreshold = 2199;
    const amountNeeded = freeShippingThreshold - subtotal;
    const progress = subtotal / freeShippingThreshold;

    useEffect(() => {
        setCartAmount(cartProducts.reduce((sum, item) => sum + item.salePrice * item.quantity, 0));
    }, [cartProducts]);

    if (isLoading) {
        return (
            <LinearGradient
                colors={["#121212", "#1E1E1E", "#252525"]}
                style={[styles.container, styles.loadingContainer]}
            >
                <LottieView
                    source={{ uri: 'https://lottie.host/cd4d1dff-256b-461b-8b32-0cd291ff2e26/UZnRwRqeiq.lottie' }}
                    autoPlay
                    loop
                    style={styles.lottie}
                />
            </LinearGradient> 
        )
    }

    return (
        <LinearGradient colors={["#121212", "#1E1E1E"]} style={{ flex: 1, paddingBottom: 100 }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Your Cart</Text>
                    <View style={{ width: 24 }} />
                </View>

                {cartProducts.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="remove-shopping-cart" size={80} color="#555" />
                        <Text style={styles.emptyContainerText}>Your cart is empty</Text>
                        <Text style={styles.emptyContainerSubtext}>Browse our collection to add items</Text>
                        <TouchableOpacity 
                            style={styles.continueShoppingButton}
                            onPress={() => navigation.navigate('products')}
                        >
                            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={cartProducts}
                        keyExtractor={(item) => item.cartItemId} // Use cartItemId
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <View style={styles.itemContainer}>
                                <Image source={{ uri: item.image }} style={styles.image} />
                                <View style={styles.details}>
                                    <Text style={styles.title}>{item.name}</Text>
                                    <Text style={styles.attributes}>
                                        Size: {item.selectedSize} | Color: {item.selectedColor}
                                    </Text>
                                    <Text style={styles.price}>${(item.salePrice * item.quantity).toFixed(2)}</Text>
                                    <View style={styles.quantityContainer}>
                                        <TouchableOpacity 
                                            onPress={() => handleDecrement(item.cartItemId)} 
                                            style={styles.quantityButton}
                                        >
                                            <Text style={styles.quantityButtonText}>-</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.quantity}>{item.quantity}</Text>
                                        <TouchableOpacity 
                                            onPress={() => handleIncrement(item.cartItemId)} 
                                            style={styles.quantityButton}
                                        >
                                            <Text style={styles.quantityButtonText}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity 
                                    style={styles.deleteButton} 
                                    onPress={() => handleDelete(item.cartItemId)}
                                >
                                    <Ionicons name="close" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                )}

                {cartProducts.length > 0 && (
                    <View style={styles.footer}>
                        <View style={styles.shippingContainer}>
                            {amountNeeded > 0 ? (
                                <Text style={styles.freeShippingText}>
                                    Spend <Text style={styles.amountNeeded}>${amountNeeded.toFixed(2)}</Text> more for free shipping
                                </Text>
                            ) : (
                                <Text style={styles.freeShippingAchieved}>🎉 Free shipping unlocked!</Text>
                            )}
                            <ProgressBar 
                                progress={progress} 
                                color="#BB86FC" 
                                style={styles.progress} 
                            />
                        </View>

                        <View style={styles.subtotalContainer}>
                            <Text style={styles.subtotalLabel}>Subtotal:</Text>
                            <Text style={styles.subtotalAmount}>${subtotal.toFixed(2)}</Text>
                        </View>

                        <TouchableOpacity 
                            style={styles.checkoutButton} 
                            onPress={() => navigation.navigate("profile-page/check-out")}
                        >
                            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Ionicons name="cart-outline" size={50} color="#BB86FC" />
                            <Text style={styles.modalTitle}>Empty Cart</Text>
                            <Text style={styles.modalText}>Your cart is currently empty.</Text>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Continue Shopping</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingBottom: 185 
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    lottie: {
        width: 200,
        height: 200,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    listContent: {
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
        position: 'relative',
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 8,
        marginRight: 15,
    },
    details: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 5,
    },
    attributes: {
        fontSize: 14,
        color: '#aaa',
        marginBottom: 5,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#BB86FC',
        marginBottom: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        backgroundColor: '#333',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    quantity: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginHorizontal: 15,
        minWidth: 20,
        textAlign: 'center',
    },
    deleteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#FF0266',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1E1E1E',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    shippingContainer: {
        marginBottom: 15,
    },
    freeShippingText: {
        color: '#aaa',
        fontSize: 14,
        marginBottom: 5,
        textAlign: 'center',
    },
    amountNeeded: {
        color: '#BB86FC',
        fontWeight: 'bold',
    },
    freeShippingAchieved: {
        color: '#4CAF50',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 5,
    },
    progress: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#333',
    },
    subtotalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    subtotalLabel: {
        color: '#aaa',
        fontSize: 16,
    },
    subtotalAmount: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    checkoutButton: {
        backgroundColor: '#BB86FC',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyContainerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20,
    },
    emptyContainerSubtext: {
        fontSize: 16,
        color: '#aaa',
        marginTop: 10,
        marginBottom: 30,
    },
    continueShoppingButton: {
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    continueShoppingText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    modalContainer: {
        width: width - 40,
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 25,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 15,
    },
    modalText: {
        fontSize: 16,
        color: '#aaa',
        marginVertical: 15,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#BB86FC',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ShoppingCart;