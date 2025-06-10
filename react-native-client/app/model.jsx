import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Share,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const ModelRecruitment = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    height: '',
    age: '',
    experience: '',
    photos: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(100)).current;

  const featuredModels = [
    { name: "Elena Vostrikov", agency: "Elite Paris", stats: "180cm | 22y" },
    { name: "Marcus Chen", agency: "Ford Models", stats: "188cm | 25y" },
    { name: "Aisha Diallo", agency: "IMG Worldwide", stats: "178cm | 20y" }
  ];

  const partnerBrands = [
    { name: "Vogue", icon: "magazine" },
    { name: "Gucci", icon: "shopping-bag" },
    { name: "Chanel", icon: "diamond" },
    { name: "Prada", icon: "tshirt-crew" }
  ];

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true
      })
    ]).start();
  };

  React.useEffect(() => {
    animateIn();
  }, []);

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      Alert.alert('Required Fields', 'Please fill in at least your name and phone number');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const message = `Hello Aditya,\n\nI'm interested in joining Elite Models. Here are my details:\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Email:* ${formData.email || 'Not provided'}\n*Height:* ${formData.height || 'Not provided'} cm\n*Age:* ${formData.age || 'Not provided'}\n*Experience:* ${formData.experience || 'None'}\n*Portfolio:* ${formData.photos || 'Not provided'}\n\nI look forward to hearing from you!`;
      
      const whatsappUrl = `whatsapp://send?phone=+918318638602&text=${encodeURIComponent(message)}`;
      
      // Check if WhatsApp is installed
      const supported = await Linking.canOpenURL(whatsappUrl);
      
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        // If WhatsApp is not installed, open in browser
        const webUrl = `https://wa.me/918318638602?text=${encodeURIComponent(message)}`;
        await Linking.openURL(webUrl);
      }
      
      // Clear form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        height: '',
        age: '',
        experience: '',
        photos: ''
      });
      
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Could not open WhatsApp. Please make sure WhatsApp is installed.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <LinearGradient colors={['#000000', '#1a1a2e', '#16213e']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <View style={styles.logoContainer}>
              <MaterialIcons name="star" size={28} color="#f8c100" />
              <Text style={styles.logoText}>ELITE MODELS</Text>
            </View>

            <Text style={styles.title}>Join the Elite</Text>
            <Text style={styles.subtitle}>
              Walk for the world's most prestigious brands and grace the covers of top fashion magazines
            </Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>200+</Text>
                <Text style={styles.statLabel}>Models</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>50+</Text>
                <Text style={styles.statLabel}>Countries</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1000+</Text>
                <Text style={styles.statLabel}>Campaigns</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>Our Featured Faces</Text>
            <View style={styles.modelsContainer}>
              {featuredModels.map((model, index) => (
                <View key={index} style={styles.modelCard}>
                  <View style={styles.modelImagePlaceholder}>
                    <FontAwesome name="user" size={30} color="#fff" />
                  </View>
                  <Text style={styles.modelName}>{model.name}</Text>
                  <Text style={styles.modelAgency}>{model.agency}</Text>
                  <Text style={styles.modelStats}>{model.stats}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>We Work With</Text>
            <View style={styles.brandsContainer}>
              {partnerBrands.map((brand, index) => (
                <View key={index} style={styles.brandItem}>
                  <MaterialIcons name={brand.icon} size={24} color="#fff" />
                  <Text style={styles.brandName}>{brand.name}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }]
              }
            ]}
          >
            <Text style={styles.formTitle}>Application Form</Text>
            <Text style={styles.formSubtitle}>We review every application personally</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Your professional email"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Your contact number"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 175"
                  keyboardType="numeric"
                  value={formData.height}
                  onChangeText={(text) => handleInputChange('height', text)}
                  placeholderTextColor="#666"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 22"
                  keyboardType="numeric"
                  value={formData.age}
                  onChangeText={(text) => handleInputChange('age', text)}
                  placeholderTextColor="#666"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Experience</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Previous agencies, shows, campaigns..."
                multiline
                numberOfLines={3}
                value={formData.experience}
                onChangeText={(text) => handleInputChange('experience', text)}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Portfolio Links</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Instagram, portfolio website, Dropbox..."
                multiline
                numberOfLines={3}
                value={formData.photos}
                onChangeText={(text) => handleInputChange('photos', text)}
                placeholderTextColor="#666"
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#000" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.submitButtonText}>SUBMIT APPLICATION</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#000" />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
              <Text style={styles.infoText}>
                Your application will be sent via WhatsApp to: +91 8318638602
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingTop: 35,
    paddingBottom: 60,
  },
  scrollContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 30,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 15,
    padding: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#f8c100',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    letterSpacing: 1,
  },
  modelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modelCard: {
    width: '30%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  modelImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  modelName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  modelAgency: {
    color: '#f8c100',
    fontSize: 10,
    marginTop: 5,
    textAlign: 'center',
  },
  modelStats: {
    color: '#aaa',
    fontSize: 10,
    marginTop: 5,
    textAlign: 'center',
  },
  brandsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  brandItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  brandName: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 14,
  },
  formContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 15,
    padding: 25,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  formTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  formSubtitle: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#f8c100',
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#f8c100',
    borderRadius: 8,
    padding: 18,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#f8c100',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
    marginRight: 10,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 193, 0, 0.1)',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(248, 193, 0, 0.2)',
  },
  infoText: {
    color: '#f8c100',
    marginLeft: 10,
    flex: 1,
    fontSize: 12,
  },
});

export default ModelRecruitment;