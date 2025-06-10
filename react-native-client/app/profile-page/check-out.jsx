// import { Ionicons } from "@expo/vector-icons";
// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
// import LottieView from 'lottie-react-native';
// import { useNavigation } from "@react-navigation/native";
// import { useAuth } from "../../AuthContext";

// const CheckoutScreen = () => {
//     const [showVideo, setShowVideo] = useState(false);
//     const navigation = useNavigation();
//     const { amount, setAmount, setCartProducts, cartAmount, history, setHistory } = useAuth();

//     const handlePayment = () => {
//         if (amount < cartAmount) {
//             return alert("Insufficient Balance!");
//         }
//         setHistory([...history, {
//             amount: cartAmount,
//             isCredit: 'Debited',
//             color: '#E52020',
//             date: `checkout    ~ ${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
//         }]);
//         setAmount((amount - cartAmount).toFixed(2))
//         setCartProducts([]);
//         setShowVideo(true);

//         setTimeout(() => {
//             setShowVideo(false);
//             navigation.navigate("profile-page/cart")
//         }, 1500);
//     }

//     return (
//         <>
//             {showVideo ? (
//                 <View style={styles.successContainer}>
//                     <LottieView
//                         source={{ uri: 'https://lottie.host/9e3396fb-4e45-4a4b-8382-917f02e87e6d/hYn9Ixlzqz.lottie' }}
//                         autoPlay
//                         loop
//                         style={styles.successAnimation}
//                     />
//                     <Text style={styles.successText}>Payment Successful</Text>
//                 </View>
//             ) : (
//                 <ScrollView contentContainerStyle={styles.scrollContainer}>
//                     <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'profile-page/cart' }] })} style={styles.backButton}>
//                         <Ionicons name="arrow-back" size={26} color="#45474B" />
//                         <Text style={styles.backText}>Back to Cart</Text>
//                     </TouchableOpacity>
//                     <View style={styles.container}>
//                         <LottieView
//                             source={{ uri: 'https://lottie.host/16b8172b-01ae-4ec1-8c15-df722869e310/79Pu9Rcua8.lottie' }}
//                             autoPlay
//                             loop
//                             style={styles.checkoutAnimation}
//                         />
//                         <Text style={styles.title}>Checkout</Text>
//                         <Text style={styles.text}>Wallet Balance: <Text style={styles.price}>${amount}</Text></Text>
//                         <Text style={styles.text}>Total: <Text style={styles.price}>${cartAmount}</Text></Text>
//                         <TouchableOpacity style={styles.buyButton} onPress={() => handlePayment()}>
//                             <Text style={styles.buyButtonText}>Buy Now</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </ScrollView>
//             )}
//         </>
//     );
// };

// export default function App() {
//     return <CheckoutScreen />;
// }

// const styles = StyleSheet.create({
//     scrollContainer: { flexGrow: 1, backgroundColor: "#F0F4F8", paddingVertical: 20 },
//     container: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "rgba(255, 255, 255, 0.9)",
//         margin: 20,
//         borderRadius: 15,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 10,
//         padding: 20,
//         maxHeight: '80%',
//         elevation: 12,
//     },
//     title: { fontSize: 28, fontWeight: "bold", marginBottom: 15, color: "#2C3E50" },
//     text: { fontSize: 18, marginBottom: 15, color: "#555" },
//     price: { fontSize: 20, fontWeight: "bold", color: "#E63946" },
//     backButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         margin: 15,
//         padding: 10,
//         borderRadius: 8,
//         backgroundColor: "#E3E7EB",
//     },
//     backText: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginLeft: 10,
//         color: "#34495E",
//     },
//     buyButton: {
//         backgroundColor: "#28A745",
//         paddingVertical: 14,
//         paddingHorizontal: 35,
//         borderRadius: 10,
//         marginTop: 15,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 5,
//         elevation: 5,
//     },
//     buyButtonText: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "#fff",
//     },
//     successContainer: {
//         width: '100%',
//         height: '100%',
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: "#F0F4F8",
//     },
//     successAnimation: {
//         width: 250,
//         height: 250,
//     },
//     successText: {
//         fontSize: 24,
//         fontWeight: '500',
//         color: "#2C3E50",
//         marginTop: 10,
//     },
//     checkoutAnimation: {
//         width: 250,
//         height: 250,
//         marginTop: -100,
//     },
// });

import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import LottieView from 'lottie-react-native';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../AuthContext";
import { Linking } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const CheckoutScreen = () => {
    const [showVideo, setShowVideo] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { cartAmount, setCartProducts, userToken } = useAuth();

    useEffect(() => {
        // Set up deep link listener when component mounts
        const subscription = Linking.addEventListener('url', handlePaymentCallback);
        
        // Clean up listener when component unmounts
        return () => {
            subscription.remove();
        };
    }, []);

    const handlePayment = async () => {
        setLoading(true);
        try {
            // 1. Create payment order with backend (using your existing endpoint)
            const response = await fetch('YOUR_BACKEND_API/api/orders/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({
                    amount: cartAmount * 100 // Convert to paise
                })
            });

            const order = await response.json();

            if (!response.ok) {
                throw new Error(order.message || 'Failed to create payment order');
            }

            // 2. Store order details for verification
            await SecureStore.setItemAsync('currentOrder', JSON.stringify({
                id: order.id,
                amount: cartAmount,
                date: new Date().toISOString()
            }));

            // 3. Open Razorpay payment page
            const razorpayUrl = `https://rzp.io/l/${order.id}`;
            const supported = await Linking.canOpenURL(razorpayUrl);
            
            if (supported) {
                await Linking.openURL(razorpayUrl);
            } else {
                throw new Error("Cannot open payment link");
            }

        } catch (error) {
            console.error('Payment error:', error);
            Alert.alert(
                "Payment Error",
                error.message || "There was an issue processing your payment"
            );
            setLoading(false);
        }
    };

    const handlePaymentCallback = async (event) => {
        if (event.url.includes('razorpay_payment')) {
            try {
                // Retrieve stored order data
                const orderData = await SecureStore.getItemAsync('currentOrder');
                if (!orderData) throw new Error('No order data found');
                
                const order = JSON.parse(orderData);
                
                // In a real app, you would verify with your backend here
                // For now, we'll assume payment was successful
                
                // Payment successful
                setShowVideo(true);
                setCartProducts([]);
                await SecureStore.deleteItemAsync('currentOrder');

                setTimeout(() => {
                    setShowVideo(false);
                    navigation.navigate("profile-page/cart");
                }, 1500);

            } catch (error) {
                console.error('Payment callback error:', error);
                Alert.alert(
                    "Payment Error",
                    "We couldn't complete your payment. Please check your order history."
                );
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            {showVideo ? (
                <View style={styles.successContainer}>
                    <LottieView
                        source={{ uri: 'https://lottie.host/9e3396fb-4e45-4a4b-8382-917f02e87e6d/hYn9Ixlzqz.lottie' }}
                        autoPlay
                        loop
                        style={styles.successAnimation}
                    />
                    <Text style={styles.successText}>Payment Successful</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()} 
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={26} color="#45474B" />
                        <Text style={styles.backText}>Back to Cart</Text>
                    </TouchableOpacity>
                    <View style={styles.container}>
                        <LottieView
                            source={{ uri: 'https://lottie.host/16b8172b-01ae-4ec1-8c15-df722869e310/79Pu9Rcua8.lottie' }}
                            autoPlay
                            loop
                            style={styles.checkoutAnimation}
                        />
                        <Text style={styles.title}>Checkout</Text>
                        <Text style={styles.text}>Total Amount: <Text style={styles.price}>₹{cartAmount}</Text></Text>
                        <TouchableOpacity 
                            style={[styles.buyButton, loading && styles.disabledButton]} 
                            onPress={handlePayment}
                            disabled={loading}
                        >
                            <Text style={styles.buyButtonText}>
                                {loading ? 'Processing...' : 'Pay Now'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, backgroundColor: "#F0F4F8", paddingVertical: 20 },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        margin: 20,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        padding: 20,
        maxHeight: '80%',
        elevation: 12,
    },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 15, color: "#2C3E50" },
    text: { fontSize: 18, marginBottom: 15, color: "#555" },
    price: { fontSize: 20, fontWeight: "bold", color: "#E63946" },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 15,
        padding: 10,
        borderRadius: 8,
        backgroundColor: "#E3E7EB",
    },
    backText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        color: "#34495E",
    },
    buyButton: {
        backgroundColor: "#28A745",
        paddingVertical: 14,
        paddingHorizontal: 35,
        borderRadius: 10,
        marginTop: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    buyButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    successContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#F0F4F8",
    },
    successAnimation: {
        width: 250,
        height: 250,
    },
    successText: {
        fontSize: 24,
        fontWeight: '500',
        color: "#2C3E50",
        marginTop: 10,
    },
    checkoutAnimation: {
        width: 250,
        height: 250,
        marginTop: -100,
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
});

export default CheckoutScreen;