import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { BackHandler, Platform } from "react-native"; // Import BackHandler and Platform
import LoginForm from "./login-singup/login";
import SignupForm from "./login-singup/signup";
import { Tabs } from "expo-router";
import TabBar from "../components/TabBar";
import { useAuth } from "../AuthContext";
import { Keyboard } from "react-native";

const Stack = createStackNavigator();

const Navigation = () => {
  const { isLogin, setIsLogin, userId, setUserId } = useAuth();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Handle Android back button
  // useEffect(() => {
  //   if (Platform.OS !== "web") {
  //     const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
  //       if (!isLogin) {
  //         // Prevent back button from exiting app on login/signup screens
  //         return true;
  //       }
  //       return false; // Allow default back behavior for tab navigation
  //     });

  //     return () => backHandler.remove();
  //   }
  // }, [isLogin]);
  useEffect(() => {
    if (Platform.OS !== "web") {
      const backAction = () => {
        if (!isLogin) {
          return true; // Prevent exiting app on login/signup screens
        }
        return false; // Allow default back behavior
      };

      const backHandlerSubscription = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => {
        if (backHandlerSubscription && backHandlerSubscription.remove) {
          backHandlerSubscription.remove();
        } else {
          BackHandler.removeEventListener("hardwareBackPress", backAction);
        }
      };
    }
  }, [isLogin]);

  return (
    <>
      {isLogin ? (
        <Tabs tabBar={props => (!isKeyboardVisible ? <TabBar {...props} /> : null)} initialRouteName="home">
          <Tabs.Screen name="home" options={{ title: "Home", headerShown: false }} />
          <Tabs.Screen name="products" options={{ title: "Products", headerShown: false }} />
          <Tabs.Screen name="model" options={{ title: "Model", headerShown: false }} />
          <Tabs.Screen name="ssp" options={{ title: "SSP", headerShown: false }} />
          <Tabs.Screen
            name="profile"
            options={{ title: "Profile", headerShown: false }}
            initialParams={{ userId }}
          />
          <Tabs.Screen
            name="profile-page/dog-breed-detail"
            options={{ title: "Dog Breed Detail", headerShown: false }}
          />
          <Tabs.Screen
            name="profile-page/product-detail"
            options={{ title: "Product Detail", headerShown: false }}
          />
          <Tabs.Screen
            name="profile-page/cart"
            options={{ title: "Cart", headerShown: false }}
          />
          <Tabs.Screen
            name="profile-page/check-out"
            options={{ title: "Check Out", headerShown: false }}
          />
          <Tabs.Screen
            name="profile-page/wishlist"
            options={{ title: "Wishlist", headerShown: false }}
          />
        </Tabs>
      ) : (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {props => <LoginForm {...props} setIsLogin={setIsLogin} setUserId={setUserId} />}
          </Stack.Screen>
          <Stack.Screen name="Signup" component={SignupForm} options={{ headerShown: false }} />
        </Stack.Navigator>
      )}
    </>
  );
};

export default Navigation;