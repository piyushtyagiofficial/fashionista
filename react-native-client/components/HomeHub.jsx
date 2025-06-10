import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";

const FashionServicesScreen = () => {
  const navigation = useNavigation();
  const services = [
    {
      id: 1,
      title: "Personal Stylist",
      icon: "account-tie",
      description: "Get expert fashion advice tailored to you",
      color: "#FF3E6C",
      action: "Book Session",
      screen: "stylist",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      title: "Premium Tailoring",
      icon: "needle",
      description: "Custom alterations for perfect fit",
      color: "#8B5CF6",
      action: "Schedule Now",
      screen: "tailoring",
      image: "https://images.unsplash.com/photo-1598915850252-fb07ad1e6768?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGFpbG9yaW5nfGVufDB8fDB8fHww"
    },
    {
      id: 3,
      title: "VIP Shopping",
      icon: "diamond-stone",
      description: "Exclusive access to new collections",
      color: "#0EA5E9",
      action: "Join VIP",
      screen: "vip",
      image: "https://plus.unsplash.com/premium_photo-1731267168482-4a3e3bfc334b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dmlwJTIwc2hvcGluZ3xlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      id: 4,
      title: "Wardrobe Consult",
      icon: "hanger",
      description: "Professional closet organization",
      color: "#10B981",
      action: "Get Started",
      screen: "wardrobe",
      image: "https://images.unsplash.com/photo-1585914924626-15adac1e6402?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d2FyZHJvYmUlMjBjb25zdWx0fGVufDB8fDB8fHww"
    },
    {
      id: 5,
      title: "Express Delivery",
      icon: "truck-fast",
      description: "Next-day delivery for metro areas",
      color: "#F59E0B",
      action: "See Options",
      screen: "delivery",
      image: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 6,
      title: "Gift Service",
      icon: "gift-outline",
      description: "Curated luxury gift packages",
      color: "#6366F1",
      action: "Explore",
      screen: "gifts",
      image: "https://images.unsplash.com/photo-1665394786439-6e69125428a0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGdpZnQlMjBzdXJ2aWNlJTIwb2YlMjBjbG90aHN8ZW58MHx8MHx8fDA%3D"
    },
  ];


  return (
    <LinearGradient colors={["#121212", "#1E1E1E"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Premium Services</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Hero Banner */}
        <Animatable.View animation="fadeIn" duration={800}>
          <View style={styles.heroContainer}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80" }}
              style={styles.heroImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.heroGradient}
            />
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>ELEVATE YOUR STYLE</Text>
              <Text style={styles.heroSubtitle}>Exclusive services for fashion connoisseurs</Text>
            </View>
          </View>
        </Animatable.View>

        {/* Services Grid */}
        <Text style={styles.sectionTitle}>Our Services</Text>
        <View style={styles.grid}>
          {services.map((service, index) => (
            <Animatable.View
              key={service.id}
              animation="fadeInUp"
              delay={index * 100}
              style={styles.serviceCard}
            >
              <Image
                source={{ uri: service.image }}
                style={styles.serviceImage}
              />
              <View style={[styles.serviceBadge, { backgroundColor: service.color }]}>
                <MaterialCommunityIcons name={service.icon} size={20} color="#fff" />
              </View>
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                <TouchableOpacity
                  style={[styles.serviceButton, { borderColor: service.color }]}
                  onPress={() => navigation.navigate(service.screen)}
                >
                  <Text style={[styles.serviceButtonText, { color: service.color }]}>
                    {service.action}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          ))}
        </View>

        {/* Concierge Banner */}
        <Animatable.View
          animation="pulse"
          iterationCount="infinite"
          style={styles.conciergeBanner}
        >
          <Ionicons name="ios-sparkles" size={32} color="#FFD700" />
          <Text style={styles.conciergeTitle}>STYLE CONCIERGE</Text>
          <Text style={styles.conciergeText}>24/7 personal shopping assistance</Text>
          <TouchableOpacity style={styles.conciergeButton}>
            <Text style={styles.conciergeButtonText}>CONTACT NOW</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  heroContainer: {
    height: 200,
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
    height: '50%',
  },
  heroTextContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  heroSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  serviceCard: {
    width: '48%',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    position: 'relative',
  },
  serviceImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  serviceBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  serviceContent: {
    padding: 12,
  },
  serviceTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 5,
  },
  serviceDescription: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 12,
    minHeight: 35,
  },
  serviceButton: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 6,
    alignItems: 'center',
  },
  serviceButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  conciergeBanner: {
    backgroundColor: '#1A1A2E',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  conciergeTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    letterSpacing: 1,
  },
  conciergeText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  conciergeButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  conciergeButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
});

export default FashionServicesScreen;