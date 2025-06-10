// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import LottieView from 'lottie-react-native';
// import { LinearGradient } from 'expo-linear-gradient';

// const SignupForm = () => {
//     const navigation = useNavigation();
//     const [userData, setUserData] = useState({
//         fullName: '',
//         email: '',
//         password: ''
//     });
//     const [isLoading, setIsLoading] = useState(false);
//     const [showVideo, setShowVideo] = useState(false);

//     const handleSignup = async () => {
//         try {
//             setIsLoading(true);
//             const response = await axios.post('http://192.168.101.7:3000/register', userData);
//             console.log('Response:', response.data);
//             if (response.status === 200) {
//                 setShowVideo(true);
//                 setTimeout(() => {
//                     setShowVideo(false);
//                 }, 1500);
//             }
//             setIsLoading(false);
//         } catch (error) {
//             if (error.response) {
//                 console.error('Response Error:', error.response.data);
//             } else if (error.request) {
//                 console.error('No Response from Server:', error.request);
//             } else {
//                 console.error('Request Error:', error.message);
//             }
//         }
//     };

//     return (
//         <>
//             <LinearGradient colors={['#F8E8EE', '#FF8383']} style={styles.container}>
//                 <View style={styles.form}>
//                     {showVideo ? (
//                         <View style={styles.animationContainer}>
//                             <LottieView
//                                 source={{ uri: 'https://lottie.host/9e3396fb-4e45-4a4b-8382-917f02e87e6d/hYn9Ixlzqz.lottie' }}
//                                 autoPlay
//                                 loop
//                                 style={styles.lottie}
//                             />
//                             <Text style={styles.successText}>Account Created</Text>
//                         </View>
//                     ) : (
//                         <>
//                             <LottieView
//                                 source={{ uri: 'https://lottie.host/8e220ecf-6a6a-4cd1-9684-0615cfb05215/gT4KJQWV9f.lottie' }}
//                                 autoPlay
//                                 loop
//                                 style={styles.topAnimation}
//                             />
//                             <Text style={styles.title}>Create an Account</Text>
//                             <View style={styles.inputContainer}>
//                                 <Text style={styles.label}>Full Name</Text>
//                                 <TextInput
//                                     placeholder='Full Name'
//                                     style={styles.input}
//                                     value={userData.fullName}
//                                     onChangeText={(text) => setUserData({ ...userData, fullName: text })}
//                                 />
//                             </View>
//                             <View style={styles.inputContainer}>
//                                 <Text style={styles.label}>Email</Text>
//                                 <TextInput
//                                     placeholder='Email'
//                                     style={styles.input}
//                                     keyboardType="email-address"
//                                     autoCapitalize="none"
//                                     value={userData.email}
//                                     onChangeText={(text) => setUserData({ ...userData, email: text })}
//                                 />
//                             </View>
//                             <View style={styles.inputContainer}>
//                                 <Text style={styles.label}>Password</Text>
//                                 <TextInput
//                                     placeholder='Password'
//                                     style={styles.input}
//                                     secureTextEntry={true}
//                                     value={userData.password}
//                                     onChangeText={(text) => setUserData({ ...userData, password: text })}
//                                 />
//                             </View>
//                             <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={isLoading}>
//                                 <LinearGradient colors={['#ff6b6b', '#ff8e53']} style={styles.gradientButton}>
//                                     {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
//                                 </LinearGradient>
//                             </TouchableOpacity>
//                             <Text style={styles.signupText}>
//                                 Already have an account?
//                                 <Text style={styles.signupLink} onPress={() => navigation.goBack()}> Log in</Text>
//                             </Text>
//                         </>
//                     )}
//                 </View>
//             </LinearGradient>
//         </>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//         borderRadius: 20,
//         overflow: 'hidden'
//     },
//     animationContainer: {
//         width: '100%',
//         height: '100%',
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#fff'
//     },
//     lottie: {
//         width: 250,
//         height: 250,
//     },
//     successText: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#333'
//     },
//     topAnimation: {
//         width: 210,
//         height: 210,
//         marginBottom: 20,
//         marginLeft: 50,
//     },
//     form: {
//         width: '90%',
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 20,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 6,
//         elevation: 5
//     },
//     title: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         color: '#333',
//         textAlign: 'center',
//         marginBottom: 20
//     },
//     inputContainer: {
//         width: '100%',
//         marginBottom: 15
//     },
//     label: {
//       color: '#EB5B00',
//       fontWeight: '700',
//       marginBottom: 5,
//       fontSize: 16,
//     },
//     input: {
//         backgroundColor: '#f8f9fa',
//         padding: 12,
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: '#ddd',
//         fontSize: 16,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.2,
//         shadowRadius: 1.5,
//         elevation: 3
//     },
//     button: {
//         width: '100%',
//         borderRadius: 30,
//         marginTop: 10
//     },
//     gradientButton: {
//         paddingVertical: 12,
//         paddingHorizontal: 24,
//         borderRadius: 30,
//         alignItems: 'center'
//     },
//     buttonText: {
//         color: '#fff',
//         fontWeight: '600',
//         fontSize: 16
//     },
//     signupText: {
//         marginTop: 20,
//         color: '#333',
//         textAlign: 'center'
//     },
//     signupLink: {
//         color: '#ff6b6b',
//         fontWeight: 'bold',
//         textDecorationLine: 'underline',
//     },
// });

// export default SignupForm;






import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SignupForm = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignup = async () => {
        try {
            setIsLoading(true);
            setErrorMessage('');
            
            const response = await axios.post('https://fashionista-red.vercel.app/api/auth/register', {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: 'buyer' // Hardcoded as buyer
            });
            
            console.log('Response:', response.data);
            
            if (response.status === 201) {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    navigation.navigate('Login');
                }, 1500);
            }
        } catch (error) {
            if (error.response) {
                console.error('Response Error:', error.response.data);
                setErrorMessage(error.response.data.message || 'Registration failed');
            } else if (error.request) {
                console.error('No Response from Server:', error.request);
                setErrorMessage('No response from server');
            } else {
                console.error('Request Error:', error.message);
                setErrorMessage('Request failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <LinearGradient colors={['#121212', '#1E1E1E']} style={styles.gradient}>
                <View style={styles.formContainer}>
                    {showSuccess ? (
                        <View style={styles.animationContainer}>
                            <LottieView
                                source={{ uri: 'https://lottie.host/9e3396fb-4e45-4a4b-8382-917f02e87e6d/hYn9Ixlzqz.lottie' }}
                                autoPlay
                                loop={false}
                                style={styles.lottie}
                            />
                            <Text style={styles.successText}>Account Created Successfully!</Text>
                        </View>
                    ) : (
                        <>
                            <View style={styles.header}>
                                <LottieView
                                    source={{ uri: 'https://lottie.host/f2dc0022-22f4-42bb-8c43-8e9f7fecae42/JQSEqVqM2R.lottie' }}
                                    autoPlay
                                    loop
                                    style={styles.topAnimation}
                                />
                                <Text style={styles.title}>Create Buyer Account</Text>
                            </View>

                            {errorMessage ? (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>{errorMessage}</Text>
                                </View>
                            ) : null}

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Full Name</Text>
                                <TextInput
                                    placeholder='Enter your full name'
                                    placeholderTextColor="#666"
                                    style={styles.input}
                                    value={userData.name}
                                    onChangeText={(text) => setUserData({ ...userData, name: text })}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    placeholder='Enter your email'
                                    placeholderTextColor="#666"
                                    style={styles.input}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={userData.email}
                                    onChangeText={(text) => setUserData({ ...userData, email: text })}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    placeholder='Enter your password'
                                    placeholderTextColor="#666"
                                    style={styles.input}
                                    secureTextEntry={true}
                                    value={userData.password}
                                    onChangeText={(text) => setUserData({ ...userData, password: text })}
                                />
                            </View>

                            <TouchableOpacity 
                                style={styles.button} 
                                onPress={handleSignup} 
                                disabled={isLoading}
                            >
                                <LinearGradient 
                                    colors={['#FF416C', '#FF4B2B']} 
                                    style={styles.gradientButton}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.buttonText}>Sign Up as Buyer</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={styles.loginContainer}>
                                <Text style={styles.loginText}>
                                    Already have an account?{' '}
                                    <Text 
                                        style={styles.loginLink} 
                                        onPress={() => navigation.goBack()}
                                    >
                                        Log in
                                    </Text>
                                </Text>
                            </View>
                        </>
                    )}
                </View>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 10,
    },
    animationContainer: {
        width: '100%',
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: 200,
        height: 200,
    },
    topAnimation: {
        width: 330,
        height: 150,
    },
    successText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4BB543',
        marginTop: 20,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        color: '#FF416C',
        fontWeight: '600',
        marginBottom: 8,
        fontSize: 14,
    },
    input: {
        backgroundColor: '#2D2D2D',
        color: '#FFF',
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    button: {
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 10,
    },
    gradientButton: {
        padding: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loginContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    loginText: {
        color: '#AAA',
    },
    loginLink: {
        color: '#FF416C',
        fontWeight: 'bold',
    },
    errorContainer: {
        backgroundColor: '#FF3333',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },
    errorText: {
        color: '#FFF',
        textAlign: 'center',
    },
});

export default SignupForm;