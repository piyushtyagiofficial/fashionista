import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../AuthContext';

const LoginForm = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { setIsLogin, setUserId, setToken, setProfileDetail } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      const response = await axios.post('https://fashionista-red.vercel.app/api/auth/login', {
        email,
        password,
      });

      console.log('Login Response:', response.data);

      if (response.data.token) {
        // Store token in AsyncStorage
        await AsyncStorage.setItem('authToken', response.data.token);
        // Update AuthContext
        setToken(response.data.token);
        setUserId(response.data._id); // Use _id from response
        setIsLogin(true);
        setProfileDetail({
          name: response.data.name || '',
          email: response.data.email,
        });

        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigation.navigate('home');
        }, 1500);
      } else {
        throw new Error('Login failed: No token received');
      }
    } catch (error) {
      console.error('Login Error:', error);
      let errorMsg = 'Login failed. Please try again.';
      if (error.response) {
        if (error.response.status === 401) {
          errorMsg = 'Invalid email or password';
        } else {
          errorMsg = error.response.data.message || errorMsg;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      setErrorMessage(errorMsg);
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
        {showSuccess ? (
          <View style={styles.successContainer}>
            <LottieView
              source={{
                uri: 'https://lottie.host/9e3396fb-4e45-4a4b-8382-917f02e87e6d/hYn9Ixlzqz.lottie',
              }}
              autoPlay
              loop={false}
              style={styles.successAnimation}
            />
            <Text style={styles.successText}>Login Successful</Text>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <View style={styles.header}>
              <LottieView
                source={{
                  uri: 'https://lottie.host/abe15251-7885-442a-9ddd-a7fb9dfe5bdb/QTxEz6sfhu.lottie',
                }}
                autoPlay
                loop
                style={styles.logoAnimation}
                onError={() => Alert.alert('Error', 'Failed to load animation')}
              />
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                accessibilityLabel="Email input"
                accessibilityHint="Enter your email address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#666"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                accessibilityLabel="Password input"
                accessibilityHint="Enter your password"
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
              <LinearGradient
                colors={['#FF416C', '#FF4B2B']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Log In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?{' '}
                <Text style={styles.footerLink} onPress={() => navigation.navigate('Signup')}>
                  Sign up
                </Text>
              </Text>
            </View>
          </View>
        )}
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
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAA',
    marginTop: 5,
  },
  inputGroup: {
    marginBottom: 20,
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
    marginBottom: 20,
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: '#AAA',
    fontSize: 14,
  },
  footerLink: {
    color: '#FF416C',
    fontWeight: 'bold',
  },
  successContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successAnimation: {
    width: 250,
    height: 250,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4BB543',
    marginTop: 20,
  },
  logoAnimation: {
    width: 330,
    height: 180,
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

export default LoginForm;