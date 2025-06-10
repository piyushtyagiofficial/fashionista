// import React from "react";
// import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
// import Modal from "react-native-modal";

// function LogoutModal({ isModalVisible, toggleModal, setShowLogoutAnimation }) {
//   const handleLogout = () => {
//     toggleModal(); // Close the modal
//     setShowLogoutAnimation(true); // Trigger the logout animation
//   };

//   return (
//     <Modal isVisible={isModalVisible} animationIn="slideInUp" animationOut="slideOutDown">
//       <View style={styles.container}>
//         <Text style={styles.title}>Are you sure you want to LOGOUT?</Text>

//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
//             <Text style={styles.cancelText}>Cancel</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//             <Text style={styles.logoutText}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// export default LogoutModal;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "white",
//     padding: 20,
//     borderRadius: 15,
//     alignItems: "center",
//     justifyContent: "center",
//     width: "85%",
//     alignSelf: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 5, // For Android shadow
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     textAlign: "center",
//     color: "#333",
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     width: "100%",
//     justifyContent: "space-between",
//     marginTop: 15,
//   },
//   cancelButton: {
//     backgroundColor: "#ccc",
//     paddingVertical: 10,
//     paddingHorizontal: 25,
//     borderRadius: 10,
//     flex: 1,
//     marginRight: 10,
//     alignItems: "center",
//   },
//   cancelText: {
//     color: "#333",
//     fontWeight: "bold",
//   },
//   logoutButton: {
//     backgroundColor: "#D9534F",
//     paddingVertical: 10,
//     paddingHorizontal: 25,
//     borderRadius: 10,
//     flex: 1,
//     marginLeft: 10,
//     alignItems: "center",
//   },
//   logoutText: {
//     color: "white",
//     fontWeight: "bold",
//   },
// });

import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../AuthContext'; // Import useAuth to access context

function LogoutModal({ isModalVisible, toggleModal, setShowLogoutAnimation }) {
  const { setToken, setIsLogin } = useAuth(); // Access setToken and setIsLogin from AuthContext

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken'); // Remove token from AsyncStorage
      setToken(null); // Clear token in context
      setIsLogin(false); // Update login state
      toggleModal(); // Close the modal
      setShowLogoutAnimation(true); // Trigger the logout animation
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  return (
    <Modal isVisible={isModalVisible} animationIn="slideInUp" animationOut="slideOutDown">
      <View style={styles.container}>
        <Text style={styles.title}>Are you sure you want to LOGOUT?</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default LogoutModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "#333",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#D9534F",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
});