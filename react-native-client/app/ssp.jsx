import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome, Ionicons, Entypo } from '@expo/vector-icons';

const InternshipOpportunityDark = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <LinearGradient
        colors={['#0f0c29', '#302b63', '#24243e']}
        style={styles.header}
      >
        <Image
          source={require('../assets/srisriport_logo.png')}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Join Our EXIM Revolution</Text>
        <Text style={styles.headerSubtitle}>Internship Opportunity - Textile Division</Text>
      </LinearGradient>

      {/* About Company Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About SriSriPort LLP</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            SriSriPort LLP is a leading Export-Import firm providing end-to-end logistics,
            custom clearance, market research, and international trade solutions.
            We're on a mission to make India a $40 Trillion economy by 2030!
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialIcons name="date-range" size={24} color="#8e7dff" />
              <Text style={styles.statText}>Since 2020</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people" size={24} color="#8e7dff" />
              <Text style={styles.statText}>50+ Experts</Text>
            </View>
            <View style={styles.statItem}>
              <FontAwesome name="globe" size={24} color="#8e7dff" />
              <Text style={styles.statText}>Global Network</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Why Join Us Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Intern With Us?</Text>
        <View style={styles.featureCard}>
          <View style={styles.featureItem}>
            <Entypo name="graduation-cap" size={24} color="#fff" style={styles.featureIcon} />
            <Text style={styles.featureText}>Hands-on experience in international textile trade</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialIcons name="work" size={24} color="#fff" style={styles.featureIcon} />
            <Text style={styles.featureText}>Mentorship from 15+ year industry experts</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome name="connectdevelop" size={24} color="#fff" style={styles.featureIcon} />
            <Text style={styles.featureText}>Build global business connections</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="md-stats-chart" size={24} color="#fff" style={styles.featureIcon} />
            <Text style={styles.featureText}>Learn complete EXIM process for textiles</Text>
          </View>
        </View>
      </View>

      {/* Services Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What You'll Learn</Text>
        <View style={styles.servicesContainer}>
          <View style={styles.serviceCard}>
            <MaterialIcons name="description" size={32} color="#8e7dff" />
            <Text style={styles.serviceTitle}>Documentation</Text>
            <Text style={styles.serviceDesc}>GST, IEC, RCMC, trade licenses</Text>
          </View>
          <View style={styles.serviceCard}>
            <Ionicons name="md-globe" size={32} color="#8e7dff" />
            <Text style={styles.serviceTitle}>Market Research</Text>
            <Text style={styles.serviceDesc}>Finding international buyers</Text>
          </View>
          <View style={styles.serviceCard}>
            <FontAwesome name="ship" size={32} color="#8e7dff" />
            <Text style={styles.serviceTitle}>Logistics</Text>
            <Text style={styles.serviceDesc}>End-to-end textile shipping</Text>
          </View>
          <View style={styles.serviceCard}>
            <MaterialIcons name="payment" size={32} color="#8e7dff" />
            <Text style={styles.serviceTitle}>Payments</Text>
            <Text style={styles.serviceDesc}>International transactions</Text>
          </View>
        </View>
      </View>

      {/* Testimonial Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Vision</Text>
        <View style={styles.testimonialCard}>
          <Text style={styles.testimonialText}>
            "Our motive is to make India an exporting economy. The very foundation of SriSriPort
            was to boost the Indian economy in a positive direction. Our goal is to make India
            a $40 Trillion Economy by 2030."
          </Text>
          <Text style={styles.testimonialAuthor}>- SriSriPort Leadership</Text>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ready to Begin Your EXIM Journey?</Text>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={async () => {
            try {
              await Linking.openURL('https://srisriport.com/');
            } catch (error) {
              console.error('Failed to open URL:', error);
            }
          }}
        >
          <LinearGradient
            colors={['#8e7dff', '#6a5acd']}
            style={styles.gradientButton}
          >
            <Text style={styles.applyButtonText}>Apply Now for Internship</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.ctaSubtext}>
          Limited positions available! Join us and be part of India's export revolution.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 35,
    paddingBottom: 100,
  },
  header: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
    tintColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: '#e0e0e0',
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8e7dff',
    marginBottom: 15,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardText: {
    fontSize: 16,
    color: '#e0e0e0',
    lineHeight: 24,
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    marginTop: 5,
    fontSize: 12,
    color: '#b0b0b0',
    textAlign: 'center',
  },
  featureCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  featureIcon: {
    marginRight: 15,
    backgroundColor: '#302b63',
    padding: 8,
    borderRadius: 8,
  },
  featureText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8e7dff',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  serviceDesc: {
    fontSize: 12,
    color: '#b0b0b0',
    textAlign: 'center',
  },
  testimonialCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  testimonialText: {
    fontSize: 16,
    color: '#e0e0e0',
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  testimonialAuthor: {
    fontSize: 14,
    color: '#8e7dff',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  applyButton: {
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 15,
    shadowColor: '#8e7dff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  gradientButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  ctaSubtext: {
    textAlign: 'center',
    color: '#b0b0b0',
    fontSize: 14,
    paddingBottom: 100
  },
});

export default InternshipOpportunityDark;