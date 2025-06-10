import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Modal,
  Image,
  TextInput,
  Button,
  BackHandler,
  Platform,
} from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import LogoutModal from '../components/LogoutModal';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Retry logic for network requests
const retry = async (fn, retries = 3, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1 || error.response) {
        throw error; // Throw if max retries reached or server responded
      }
      console.log(`Retry attempt ${i + 1}/${retries} after ${errorDelay}ms`);
      await new Promise(resolve => setTimeout(resolve, error));
    }
  }
};

// ModalContent (unchanged)
const ModalContent = ({ user, setUser, handleUpdateProfile }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || '',
    password: '',
  });

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = () => {
    const updatedUser = {
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar,
      phone: formData.phone,
      address: {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      password: formData.password || undefined,
    };
    handleUpdateProfile(updatedUser);
  };

  return (
    <ScrollView
      style={styles.modalContent}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
        placeholder="Name"
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        placeholder="Email"
        placeholderTextColor="#777"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={formData.avatar}
        onChangeText={(text) => handleChange('avatar', text)}
        placeholder="Avatar URL"
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.input}
        value={formData.phone}
        onChangeText={(text) => handleChange('phone', text)}
        placeholder="Phone"
        placeholderTextColor="#777"
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        value={formData.address}
        onChangeText={(text) => handleChange('address', text)}
        placeholder="Street Address"
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.input}
        value={formData.city}
        onChangeText={(text) => handleChange('city', text)}
        placeholder="City"
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.input}
        value={formData.state}
        onChangeText={(text) => handleChange('state', text)}
        placeholder="State"
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.input}
        value={formData.postalCode}
        onChangeText={(text) => handleChange('postalCode', text)}
        placeholder="Postal Code"
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.input}
        value={formData.country}
        onChangeText={(text) => handleChange('country', text)}
        placeholder="Country"
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.input}
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
        placeholder="Password (leave blank to keep unchanged)"
        placeholderTextColor="#777"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Save Changes" onPress={handleSubmit} color="#D4AF37" />
      </View>
    </ScrollView>
  );
};

export default function UserProfileScreen() {
  const route = useRoute();
  const { userId } = route.params || {};
  const { token, setProfileDetail, isLogin, setIsLogin } = useAuth();
  const [showLogoutAnimation, setShowLogoutAnimation] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [user, setUser] = useState({
    name: 'Alex Morgan',
    email: 'alex@example.com',
    role: 'buyer',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW9kZWx8ZW58MHx8MHx8fDA%3D',
    phone: '+1 234 567 890',
    address: {
      street: '123 Fashion St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
    },
    wishlist: [],
    isVerified: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    const fetchUserData = async () => {
      // if (!isLogin || !token || !userId) {
      //   console.log('Missing auth data:', { isLogin, token, userId });
      //   alert('Authentication required. Please log in.');
      //   navigation.navigate('Login');
      //   setIsLoading(false);
      //   return;
      // }
      if (!isLogin || !token || !userId) {
        console.log('Missing auth data:', { isLogin, token, userId });
        alert('Authentication required. Please log in.');
        setIsLogin(false); // This will trigger your navigation switch
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching user data with token:', token);
        console.log('User ID:', userId);
        const response = await retry(() => axios.get('https://fashionista-red.vercel.app/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }));
        console.log('API Response:', response.data);
        setUser(response.data);
        setProfileDetail({
          name: response.data.name || '',
          email: response.data.email || '',
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config,
        });
        alert(`Failed to load user data: ${error.response?.data?.message || error.message}`);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token, isLogin, userId, navigation, setProfileDetail]);

  // Handle back button for edit profile modal
  // useEffect(() => {
  //   if (Platform.OS === 'android' && BackHandler) {
  //     const backAction = () => {
  //       if (isBottomSheetOpen) {
  //         handleCloseBottomSheet();
  //         return true;
  //       }
  //       return false;
  //     };

  //     const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  //     return () => {
  //       try {
  //         backHandler.remove();
  //       } catch (error) {
  //         console.error('Error removing BackHandler in UserProfileScreen:', error);
  //       }
  //     };
  //   } else if (!BackHandler) {
  //     console.warn('BackHandler is undefined in UserProfileScreen. Skipping back button handling.');
  //   }
  // }, [isBottomSheetOpen]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const backAction = () => {
        if (isBottomSheetOpen) {
          handleCloseBottomSheet();
          return true; // Prevent default back behavior
        }
        return false; // Allow default back behavior
      };

      // Add the listener and get the subscription
      const backHandlerSubscription = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      // Cleanup - properly remove the listener
      return () => {
        if (backHandlerSubscription && backHandlerSubscription.remove) {
          backHandlerSubscription.remove(); // Correct method
        } else {
          BackHandler.removeEventListener('hardwareBackPress', backAction);
        }
      };
    }
  }, [isBottomSheetOpen]);

  const handleOpenBottomSheet = () => {
    setIsBottomSheetOpen(true);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  const handleUpdateProfile = async (updatedUser) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        'https://fashionista-red.vercel.app/api/auth/profile',
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const updatedUserData = response.data;
      setUser(updatedUserData);
      setProfileDetail({
        name: updatedUserData.name || '',
        email: updatedUserData.email || '',
      });
      alert('Profile updated successfully!');
      handleCloseBottomSheet();
    } catch (error) {
      console.error('Error updating profile:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      alert(`Failed to update profile: ${error.response?.data?.message || error.message}`);
    }
    setIsLoading(false);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#121212', '#1E1E1E', '#252525']}
        style={[styles.container, styles.loadingContainer]}
      >
        <LottieView
          source={{
            uri: 'https://lottie.host/cd4d1dff-256b-461b-8b32-0cd291ff2e26/UZnRwRqeiq.lottie',
          }}
          autoPlay
          loop
          style={styles.lottie}
        />
      </LinearGradient>
    );
  }

  if (showLogoutAnimation) {
    return (
      <View style={styles.successContainer}>
        <LottieView
          source={{
            uri: 'https://lottie.host/9e3396fb-4e45-4a4b-8382-917f02e87e6d/hYn9Ixlzqz.lottie',
          }}
          autoPlay
          loop={false}
          style={styles.successAnimation}
          onAnimationFinish={() => navigation.navigate('Login')}
        />
        <Text style={styles.successText}>Logged out successfully!</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#121212', '#1E1E1E']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <Image source={{ uri: user.avatar }} style={styles.profileImage} />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{user.role.toUpperCase()}</Text>
              </View>
              {user.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#D4AF37" />
                  <Text style={styles.verifiedText}>Verified Account</Text>
                </View>
              )}
            </View>
          </View>

          {/* User Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Feather name="phone" size={20} color="#D4AF37" />
                <Text style={styles.detailText}>{user.phone}</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialIcons name="location-on" size={20} color="#D4AF37" />
                <Text style={styles.detailText}>
                  {user.address?.street}, {user.address?.city}, {user.address?.state}{' '}
                  {user.address?.postalCode}
                </Text>
              </View>
            </View>
          </View>

          {/* Menu Options */}
          <View style={styles.menuSection}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleOpenBottomSheet}
            >
              <MaterialIcons name="edit" size={24} color="#D4AF37" />
              <Text style={styles.menuText}>Edit Profile</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#777"
                style={styles.menuIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('profile-page/wishlist')}
            >
              <Ionicons name="heart-outline" size={24} color="#D4AF37" />
              <Text style={styles.menuText}>
                Wishlist ({user.wishlist?.length || 0})
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#777"
                style={styles.menuIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('profile-page/cart')}
            >
              <MaterialCommunityIcons name="store" size={24} color="#D4AF37" />
              <Text style={styles.menuText}>Cart</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#777"
                style={styles.menuIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('orders')}
            >
              <Feather name="shopping-bag" size={24} color="#D4AF37" />
              <Text style={styles.menuText}>My Orders</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#777"
                style={styles.menuIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('settings')}
            >
              <Ionicons name="settings-outline" size={24} color="#D4AF37" />
              <Text style={styles.menuText}>Settings</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#777"
                style={styles.menuIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={toggleModal}>
            <Text style={styles.logoutText}>LOG OUT</Text>
          </TouchableOpacity>

          {/* Edit Profile Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isBottomSheetOpen}
            onRequestClose={handleCloseBottomSheet}
            onBackdropPress={handleCloseBottomSheet}
          >
            <View style={[styles.bottomSheet, { height: windowHeight * 0.7 }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleCloseBottomSheet}>
                  <Ionicons name="close" size={24} color="#D4AF37" />
                </TouchableOpacity>
              </View>
              <ModalContent
                user={user}
                setUser={setUser}
                handleUpdateProfile={handleUpdateProfile}
              />
            </View>
          </Modal>

          {/* Logout Confirmation Modal */}
          <LogoutModal
            isModalVisible={isModalVisible}
            toggleModal={toggleModal}
            setShowLogoutAnimation={setShowLogoutAnimation}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 40,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 200,
    height: 200,
  },
  scrollView: {
    paddingBottom: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 10,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  verifiedText: {
    fontSize: 12,
    color: '#D4AF37',
    marginLeft: 4,
  },
  detailsSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#333',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 15,
  },
  detailsGrid: {
    flexDirection: 'column',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
    flex: 1,
  },
  menuSection: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 15,
    flex: 1,
  },
  menuIcon: {
    marginLeft: 'auto',
  },
  logoutButton: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    marginTop: 30,
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  logoutText: {
    fontWeight: 'bold',
    color: '#D4AF37',
    fontSize: 16,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 15,
    bottom: 0,
    borderColor: '#333',
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successAnimation: {
    width: 200,
    height: 200,
  },
  successText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 20,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    width: '100%',
    backgroundColor: '#1E1E1E',
  },
  input: {
    backgroundColor: '#333',
    color: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
});