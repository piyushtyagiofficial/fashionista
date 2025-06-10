// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ToastAndroid, TextInput, Modal, Alert } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { useAuth } from '../../AuthContext';
// import LottieView from 'lottie-react-native';
// import RazorpayCheckout from 'react-native-razorpay';
// import axios from 'axios';

// export default function Wallet() {
//   const { amount, setAmount, history, setHistory, user } = useAuth();
//   const navigation = useNavigation();
//   const [customAmount, setCustomAmount] = useState('');
//   const [showCustomAmountModal, setShowCustomAmountModal] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const createOrder = async (paymentAmount) => {
//     try {
//       setLoading(true);
//       const response = await axios.post('https://fashionista-red.vercel.app/api/orders/create-payment', {
//         amount: paymentAmount
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Order creation failed:', error);
//       ToastAndroid.show('Failed to create payment order', ToastAndroid.SHORT);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyPayment = async (orderId, paymentId, signature) => {
//     try {
//       await axios.put(`https://fashionista-red.vercel.app/api/orders/${orderId}/pay`, {
//         razorpay_order_id: orderId,
//         razorpay_payment_id: paymentId,
//         razorpay_signature: signature
//       });
//       return true;
//     } catch (error) {
//       console.error('Payment verification failed:', error);
//       return false;
//     }
//   };

//   const initiatePayment = async (paymentAmount) => {
//     if (loading) return;

//     // Validate amount
//     if (isNaN(paymentAmount) || paymentAmount <= 0) {
//       ToastAndroid.show('Please enter a valid amount', ToastAndroid.SHORT);
//       return;
//     }

//     try {
//       // Step 1: Create order on your backend
//       const order = await createOrder(paymentAmount);
//       if (!order) return;

//       // Step 2: Open Razorpay checkout
//       const options = {
//         description: 'Adding to wallet balance',
//         // image: 'https://your-logo-url.png',
//         currency: 'INR',
//         key: '6OdM5tGits7cJA384zuJlT7o', // Replace with your key
//         amount: order.amount,
//         name: 'Your App Name',
//         order_id: 'rzp_test_XYimcgrzN7OfeL', // Use the order ID from your backend
//         prefill: {
//           email: user?.email || 'user@example.com',
//           contact: user?.phone || '9191919191',
//           name: user?.name || 'User Name'
//         },
//         theme: { color: '#007bff' }
//       };

//       const data = await RazorpayCheckout.open(options);

//       // Step 3: Verify payment with your backend
//       const isVerified = await verifyPayment(
//         data.razorpay_order_id,
//         data.razorpay_payment_id,
//         data.razorpay_signature
//       );

//       if (isVerified) {
//         // Update local state only after successful verification
//         const newAmount = (parseInt(amount) + paymentAmount).toString();
//         setAmount(newAmount);

//         setHistory([...history, {
//           amount: paymentAmount,
//           isCredit: 'Credited',
//           color: '#5CB338',
//           date: new Date().toLocaleDateString(),
//           paymentId: data.razorpay_payment_id
//         }]);

//         ToastAndroid.show(`₹${paymentAmount} credited successfully!`, ToastAndroid.SHORT);
//       } else {
//         ToastAndroid.show('Payment verification failed', ToastAndroid.SHORT);
//       }
//     } catch (error) {
//       if (error.description === 'Payment cancelled') {
//         ToastAndroid.show('Payment cancelled by user', ToastAndroid.SHORT);
//       } else {
//         console.error('Payment Error:', error);
//         ToastAndroid.show(`Payment failed: ${error.description || 'Unknown error'}`, ToastAndroid.SHORT);
//       }
//     }
//   };

//   const handleCustomAmountSubmit = () => {
//     const amount = parseFloat(customAmount);
//     if (amount && amount > 0) {
//       initiatePayment(amount);
//       setShowCustomAmountModal(false);
//       setCustomAmount('');
//     } else {
//       ToastAndroid.show('Please enter a valid amount', ToastAndroid.SHORT);
//     }
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
//       <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//         <Ionicons name="arrow-back" size={26} color="#45474B" />
//         <Text style={styles.backText}>Profile</Text>
//       </TouchableOpacity>

//       <View style={styles.walletContainer}>
//         <View style={{ flexDirection: 'row' }}>
//           <Text style={styles.walletLabel}>Wallet Balance</Text>
//           <LottieView
//             source={{ uri: 'https://lottie.host/9d6ee52d-24a3-4e88-a702-f540f56be112/ujVHTy7epq.lottie' }}
//             autoPlay
//             loop
//             style={{ width: 40, height: 40, marginTop: -12, marginLeft: 10 }}
//           />
//         </View>
//         <Text style={styles.walletAmount}>₹{amount || '0'}</Text>

//         <Text style={styles.historyHeaderText}>HISTORY</Text>
//         <ScrollView style={{ height: 350 }}>
//           {history.length === 0 ? (
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyContainerText}>Empty Transaction Log!</Text>
//             </View>
//           ) : (
//             history.map((item, index) => (
//               <View key={index} style={styles.rewardContainer}>
//                 <View style={{ flexDirection: 'row' }}>
//                   <Text style={[styles.rewardAmount, { color: item.color }]}>
//                     {item.isCredit} ₹{item.amount}
//                   </Text>
//                 </View>
//                 <TouchableOpacity>
//                   <Text style={[styles.historyButton, { color: item.color }]}>
//                     {item.date}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             ))
//           )}
//         </ScrollView>

//         <Text style={styles.paymentOptionsText}>Add Money to Wallet</Text>
//         <View style={styles.quickAmountContainer}>
//           {[100, 200, 500, 1000].map((amt) => (
//             <TouchableOpacity
//               key={amt}
//               style={styles.quickAmountButton}
//               onPress={() => initiatePayment(amt)}
//               disabled={loading}
//             >
//               <Text style={styles.quickAmountText}>₹{amt}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <Text style={styles.customPaymentText}>OR</Text>
//         <TouchableOpacity
//           style={styles.customAmountButton}
//           onPress={() => setShowCustomAmountModal(true)}
//           disabled={loading}
//         >
//           <Text style={styles.customAmountButtonText}>
//             {loading ? 'Processing...' : 'Enter Custom Amount'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Custom Amount Modal */}
//       <Modal
//         visible={showCustomAmountModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowCustomAmountModal(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Enter Amount</Text>
//             <TextInput
//               style={styles.amountInput}
//               placeholder="Enter amount in ₹"
//               keyboardType="numeric"
//               value={customAmount}
//               onChangeText={setCustomAmount}
//               editable={!loading}
//             />
//             <View style={styles.modalButtonContainer}>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.cancelButton]}
//                 onPress={() => setShowCustomAmountModal(false)}
//                 disabled={loading}
//               >
//                 <Text style={styles.modalButtonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.submitButton]}
//                 onPress={handleCustomAmountSubmit}
//                 disabled={loading}
//               >
//                 <Text style={styles.modalButtonText}>
//                   {loading ? 'Processing...' : 'Proceed'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// }

// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ToastAndroid, TextInput, Modal, ActivityIndicator, Platform } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { useAuth } from '../../AuthContext';
// import LottieView from 'lottie-react-native';
// import RazorpayCheckout from 'react-native-razorpay';
// import axios from 'axios';

// export default function Wallet() {
//   const { amount, setAmount, history, setHistory, token, isLogin } = useAuth();
//   const navigation = useNavigation();
//   const [customAmount, setCustomAmount] = useState('');
//   const [showCustomAmountModal, setShowCustomAmountModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [retryCount, setRetryCount] = useState(0);
//   const MAX_RETRIES = 3;

//   const formatAmount = (value) => {
//     let formatted = value.replace(/[^0-9.]/g, '');
//     const parts = formatted.split('.');
//     if (parts.length > 2) {
//       formatted = `${parts[0]}.${parts[1].slice(0, 2)}`;
//     } else if (parts.length === 2) {
//       formatted = `${parts[0]}.${parts[1].slice(0, 2)}`;
//     }
//     return formatted;
//   };

//   const createOrder = async (paymentAmount) => {
//     if (!isLogin || !token) {
//       const errorMessage = 'Please log in to proceed with payment';
//       setError(errorMessage);
//       ToastAndroid.show(errorMessage, ToastAndroid.LONG);
//       navigation.navigate('Login');
//       return null;
//     }

//     try {
//       setLoading(true);
//       setError(null);
//       console.log('Creating order with:', { amount: paymentAmount, token }); // Debug
//       const response = await axios.post(
//         'https://fashionista-red.vercel.app/api/orders/create-payment',
//         { amount: paymentAmount },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           timeout: 15000,
//         }
//       );
//       console.log('Order creation response:', response.data); // Debug
//       return response.data;
//     } catch (error) {
//       let errorMessage = 'Failed to create payment order';
//       if (error.code === 'ECONNABORTED') {
//         errorMessage = 'Request timed out. Please try again.';
//       } else if (error.response) {
//         errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
//       } else if (error.message.includes('Network request failed')) {
//         errorMessage = 'Network error. Please check your internet connection and try again.';
//       }
//       console.error('Order creation error:', {
//         message: error.message,
//         code: error.code,
//         response: error.response?.data,
//         url: error.config?.url,
//       });
//       setError(errorMessage);
//       ToastAndroid.show(errorMessage, ToastAndroid.LONG);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyPayment = async (orderId, paymentId, signature) => {
//     if (!isLogin || !token) {
//       const errorMessage = 'Authentication required for payment verification';
//       setError(errorMessage);
//       ToastAndroid.show(errorMessage, ToastAndroid.LONG);
//       navigation.navigate('Login');
//       return false;
//     }

//     try {
//       const response = await axios.put(
//         `https://fashionista-red.vercel.app/api/orders/${orderId}/pay`,
//         {
//           razorpay_order_id: orderId,
//           razorpay_payment_id: paymentId,
//           razorpay_signature: signature,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           timeout: 15000,
//         }
//       );
//       console.log('Payment verification response:', response.data); // Debug
//       return response.data;
//     } catch (error) {
//       let errorMessage = 'Payment verification failed';
//       if (error.response) {
//         errorMessage = error.response.data.message || `Verification error: ${error.response.status}`;
//       } else if (error.message.includes('Network request failed')) {
//         errorMessage = 'Network error during verification. Please try again.';
//       }
//       console.error('Payment verification error:', {
//         message: error.message,
//         code: error.code,
//         response: error.response?.data,
//         url: error.config?.url,
//       });
//       setError(errorMessage);
//       return false;
//     }
//   };

//   const initiatePayment = async (paymentAmount, isRetry = false) => {
//     if (loading || retryCount >= MAX_RETRIES) {
//       if (retryCount >= MAX_RETRIES) {
//         ToastAndroid.show('Maximum retry attempts reached. Please try again later.', ToastAndroid.LONG);
//       }
//       return;
//     }

//     const amountNum = parseFloat(paymentAmount);
//     if (isNaN(amountNum) || amountNum < 1) {
//       ToastAndroid.show('Please enter a valid amount (minimum ₹1)', ToastAndroid.LONG);
//       return;
//     }

//     try {
//       setError(null);
//       const order = await createOrder(Math.round(amountNum * 100)); // Convert to paise
//       if (!order) return;

//       const options = {
//         description: 'Adding to wallet balance',
//         currency: 'INR',
//         key: '6OdM5tGits7cJA384zuJlT7o', // Verify this key
//         amount: order.amount,
//         name: 'Your App Name',
//         order_id: order.id,
//         prefill: {
//           email: 'user@example.com', // Replace with profileDetail.email if available
//           contact: '9191919191',
//           name: 'User Name',
//         },
//         theme: { color: '#007bff' },
//         retry: { enabled: true, max_count: 2 },
//       };

//       console.log('Razorpay options:', options); // Debug
//       const data = await RazorpayCheckout.open(options);
//       console.log('Razorpay response:', data); // Debug

//       const isVerified = await verifyPayment(
//         data.razorpay_order_id,
//         data.razorpay_payment_id,
//         data.razorpay_signature
//       );

//       if (isVerified) {
//         const newAmount = (parseFloat(amount || 0) + amountNum).toFixed(2);
//         setAmount(newAmount);
//         setHistory([
//           {
//             amount: amountNum,
//             isCredit: 'Credited',
//             color: '#5CB338',
//             date: new Date().toLocaleString(),
//             paymentId: data.razorpay_payment_id,
//           },
//           ...history,
//         ]);
//         ToastAndroid.show(`₹${amountNum.toFixed(2)} credited successfully!`, ToastAndroid.LONG);
//         setRetryCount(0);
//       } else {
//         throw new Error('Payment verification failed');
//       }
//     } catch (error) {
//       let errorMessage = 'Payment failed. Please try again.';
//       if (error.description === 'Payment cancelled') {
//         errorMessage = 'Payment cancelled by user';
//       } else if (!isRetry && retryCount < MAX_RETRIES) {
//         setRetryCount(prev => prev + 1);
//         ToastAndroid.show(`Retrying payment (${retryCount + 1}/${MAX_RETRIES})...`, ToastAndroid.LONG);
//         setTimeout(() => initiatePayment(paymentAmount, true), 1500);
//         return;
//       } else if (error.message.includes('Network request failed')) {
//         errorMessage = 'Network error. Please check your internet connection and try again.';
//       }
//       console.error('Payment error:', {
//         message: error.message,
//         code: error.code,
//         description: error.description,
//       });
//       setError(errorMessage);
//       ToastAndroid.show(errorMessage, ToastAndroid.LONG);
//       setRetryCount(0);
//     }
//   };

//   const handleCustomAmountSubmit = () => {
//     const amount = parseFloat(customAmount);
//     if (amount && amount >= 1) {
//       initiatePayment(amount);
//       setShowCustomAmountModal(false);
//       setCustomAmount('');
//     } else {
//       ToastAndroid.show('Please enter a valid amount (minimum ₹1)', ToastAndroid.LONG);
//     }
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
//       <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//         <Ionicons name="arrow-back" size={26} color="#45474B" />
//         <Text style={styles.backText}>Profile</Text>
//       </TouchableOpacity>

//       <View style={styles.walletContainer}>
//         {error && (
//           <View style={styles.errorContainer}>
//             <Text style={styles.errorText}>{error}</Text>
//           </View>
//         )}

//         <View

//  style={styles.balanceContainer}>
//           <Text style={styles.walletLabel}>Wallet Balance</Text>
//           <LottieView
//             source={{ uri: 'https://lottie.host/9d6ee52d-24a3-4e88-a702-f540f56be112/ujVHTy7epq.lottie' }}
//             autoPlay
//             loop
//             style={styles.lottieAnimation}
//           />
//         </View>
//         <Text style={styles.walletAmount}>₹{parseFloat(amount || 0).toFixed(2)}</Text>

//         <Text style={styles.historyHeaderText}>TRANSACTION HISTORY</Text>
//         <ScrollView style={styles.historyScroll}>
//           {history.length === 0 ? (
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyContainerText}>No transactions yet</Text>
//             </View>
//           ) : (
//             history.map((item, index) => (
//               <View key={index} style={styles.rewardContainer}>
//                 <View>
//                   <Text style={[styles.rewardAmount, { color: item.color }]}>
//                     {item.isCredit} ₹{parseFloat(item.amount).toFixed(2)}
//                   </Text>
//                   <Text style={styles.paymentId}>ID: {item.paymentId}</Text>
//                 </View>
//                 <Text style={[styles.historyButton, { color: item.color }]}>
//                   {item.date}
//                 </Text>
//               </View>
//             ))
//           )}
//         </ScrollView>

//         <Text style={styles.paymentOptionsText}>Add Money to Wallet</Text>
//         <View style={styles.quickAmountContainer}>
//           {[100, 200, 500, 1000].map((amt) => (
//             <TouchableOpacity
//               key={amt}
//               style={[styles.quickAmountButton, loading && styles.disabledButton]}
//               onPress={() => initiatePayment(amt)}
//               disabled={loading}
//             >
//               <Text style={styles.quickAmountText}>₹{amt}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <Text style={styles.customPaymentText}>OR</Text>
//         <TouchableOpacity
//           style={[styles.customAmountButton, loading && styles.disabledButton]}
//           onPress={() => setShowCustomAmountModal(true)}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="white" size="small" />
//           ) : (
//             <Text style={styles.customAmountButtonText}>Enter Custom Amount</Text>
//           )}
//         </TouchableOpacity>
//       </View>

//       <Modal
//         visible={showCustomAmountModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowCustomAmountModal(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Enter Amount</Text>
//             <TextInput
//               style={styles.amountInput}
//               placeholder="Enter amount in ₹ (min ₹1)"
//               keyboardType="decimal-pad"
//               value={customAmount}
//               onChangeText={(text) => setCustomAmount(formatAmount(text))}
//               editable={!loading}
//             />
//             <View style={styles.modalButtonContainer}>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.cancelButton, loading && styles.disabledButton]}
//                 onPress={() => {
//                   setShowCustomAmountModal(false);
//                   setCustomAmount('');
//                   setError(null);
//                 }}
//                 disabled={loading}
//               >
//                 <Text style={styles.modalButtonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.submitButton, loading && styles.disabledButton]}
//                 onPress={handleCustomAmountSubmit}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <ActivityIndicator color="white" size="small" />
//                 ) : (
//                   <Text style={styles.modalButtonText}>Proceed</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 16,
//   },
//   backButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingVertical: 8,
//   },
//   backText: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginLeft: 8,
//     color: '#45474B',
//   },
//   errorContainer: {
//     backgroundColor: '#FFEBEE',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   errorText: {
//     color: '#D32F2F',
//     fontSize: 14,
//   },
//   balanceContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   walletContainer: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 12,
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//     marginBottom: 20,
//   },
//   walletLabel: {
//     fontSize: 18,
//     color: '#666',
//     fontWeight: '500',
//   },
//   lottieAnimation: {
//     width: 40,
//     height: 40,
//     marginLeft: 12,
//   },
//   walletAmount: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 20,
//   },
//   historyScroll: {
//     maxHeight: 350,
//     marginVertical: 12,
//   },
//   emptyContainer: {
//     height: 300,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   emptyContainerText: {
//     fontSize: 18,
//     color: '#666',
//     fontStyle: 'italic',
//   },
//   rewardContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 12,
//     backgroundColor: '#F5F9FF',
//     borderRadius: 8,
//     marginVertical: 4,
//   },
//   rewardAmount: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   paymentId: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 4,
//   },
//   historyButton: {
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   historyHeaderText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   quickAmountContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginVertical: 16,
//     flexWrap: 'wrap',
//   },
//   quickAmountButton: {
//     backgroundColor: '#D3E671',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginVertical: 6,
//     minWidth: '22%',
//   },
//   quickAmountText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     textAlign: 'center',
//   },
//   customPaymentText: {
//     textAlign: 'center',
//     marginVertical: 12,
//     fontSize: 16,
//     color: '#666',
//     fontWeight: '500',
//   },
//   customAmountButton: {
//     backgroundColor: '#007bff',
//     padding: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginVertical: 8,
//   },
//   customAmountButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     width: '85%',
//     backgroundColor: 'white',
//     padding: 24,
//     borderRadius: 12,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginBottom: 16,
//     textAlign: 'center',
//     color: '#333',
//   },
//   amountInput: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//     fontSize: 16,
//     backgroundColor: '#f9f9f9',
//   },
//   modalButtonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 8,
//   },
//   modalButton: {
//     padding: 12,
//     borderRadius: 8,
//     width: '48%',
//     alignItems: 'center',
//   },
//   cancelButton: {
//     backgroundColor: '#f44336',
//   },
//   submitButton: {
//     backgroundColor: '#4CAF50',
//   },
//   modalButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ToastAndroid, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../AuthContext';
import axios from 'axios';

export default function Checkout() {
  const { token, isLogin, cartAmount, cartProducts } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const createOrder = async (paymentAmount) => {
    if (!isLogin || !token) {
      const errorMessage = 'Please log in to proceed with checkout';
      setError(errorMessage);
      ToastAndroid.show(errorMessage, ToastAndroid.LONG);
      navigation.navigate('Login');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Creating checkout order with:', { amount: paymentAmount, token }); // Debug
      const response = await axios.post(
        'https://fashionista-red.vercel.app/api/orders/create-payment', // Adjust if endpoint differs
        { amount: paymentAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );
      console.log('Order creation response:', response.data); // Debug
      return response.data;
    } catch (error) {
      let errorMessage = 'Failed to create payment order';
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.response) {
        errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
      } else if (error.message.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }
      console.error('Order creation error:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        url: error.config?.url,
      });
      setError(errorMessage);
      ToastAndroid.show(errorMessage, ToastAndroid.LONG);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (orderId, paymentId, signature) => {
    if (!isLogin || !token) {
      const errorMessage = 'Authentication required for payment verification';
      setError(errorMessage);
      ToastAndroid.show(errorMessage, ToastAndroid.LONG);
      navigation.navigate('Login');
      return false;
    }

    try {
      const response = await axios.put(
        `https://fashionista-red.vercel.app/api/orders/${orderId}/pay`,
        {
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );
      console.log('Payment verification response:', response.data); // Debug
      return response.data;
    } catch (error) {
      let errorMessage = 'Payment verification failed';
      if (error.response) {
        errorMessage = error.response.data.message || `Verification error: ${error.response.status}`;
      } else if (error.message.includes('Network request failed')) {
        errorMessage = 'Network error during verification. Please try again.';
      }
      console.error('Payment verification error:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        url: error.config?.url,
      });
      setError(errorMessage);
      return false;
    }
  };

  const initiatePayment = async (paymentAmount, isRetry = false) => {
    if (loading || retryCount >= MAX_RETRIES) {
      if (retryCount >= MAX_RETRIES) {
        ToastAndroid.show('Maximum retry attempts reached. Please try again later.', ToastAndroid.LONG);
      }
      return;
    }

    const amountNum = parseFloat(paymentAmount);
    if (isNaN(amountNum) || amountNum < 1) {
      ToastAndroid.show('Invalid checkout amount', ToastAndroid.LONG);
      return;
    }

    try {
      setError(null);
      const order = await createOrder(Math.round(amountNum * 100)); // Convert to paise
      if (!order) return;

      const options = {
        description: 'Checkout payment',
        currency: 'INR',
        key: '6OdM5tGits7cJA384zuJlT7o', // Verify this key
        amount: order.amount,
        name: 'Your App Name',
        order_id: order.id,
        prefill: {
          email: 'user@example.com', // Replace with profileDetail.email if available
          contact: '9191919191',
          name: 'User Name',
        },
        theme: { color: '#007bff' },
        retry: { enabled: true, max_count: 2 },
      };

      console.log('Razorpay options:', options); // Debug
      const data = await RazorpayCheckout.open(options);
      console.log('Razorpay response:', data); // Debug

      const isVerified = await verifyPayment(
        data.razorpay_order_id,
        data.razorpay_payment_id,
        data.razorpay_signature
      );

      if (isVerified) {
        ToastAndroid.show(`Payment of ₹${amountNum.toFixed(2)} successful!`, ToastAndroid.LONG);
        // Handle post-payment logic (e.g., clear cart, navigate to success screen)
        navigation.navigate('OrderSuccess');
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      let errorMessage = 'Payment failed. Please try again.';
      if (error.description === 'Payment cancelled') {
        errorMessage = 'Payment cancelled by user';
      } else if (!isRetry && retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        ToastAndroid.show(`Retrying payment (${retryCount + 1}/${MAX_RETRIES})...`, ToastAndroid.LONG);
        setTimeout(() => initiatePayment(paymentAmount, true), 1500);
        return;
      } else if (error.message.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }
      console.error('Payment error:', {
        message: error.message,
        code: error.code,
        description: error.description,
      });
      setError(errorMessage);
      ToastAndroid.show(errorMessage, ToastAndroid.LONG);
      setRetryCount(0);
    }
  };

  const handleCheckout = () => {
    if (!cartAmount || cartAmount < 1) {
      ToastAndroid.show('Cart is empty or amount is invalid', ToastAndroid.LONG);
      return;
    }
    initiatePayment(cartAmount);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={26} color="#45474B" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.checkoutContainer}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Text style={styles.headerText}>Checkout</Text>
        <Text style={styles.amountText}>Total Amount: ₹{parseFloat(cartAmount || 0).toFixed(2)}</Text>

        <TouchableOpacity
          style={[styles.checkoutButton, loading && styles.disabledButton]}
          onPress={handleCheckout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.checkoutButtonText}>Proceed to Pay</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
    color: '#45474B',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
  },
  checkoutContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  checkoutButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});