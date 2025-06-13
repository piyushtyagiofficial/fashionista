// import React, { createContext, useState, useContext, useEffect } from "react";
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLogin, setIsLogin] = useState(false);
//   const [userId, setUserId] = useState("");
//   const [token, setToken] = useState(null); // New state for token
//   const [amount, setAmount] = useState(0);
//   const [history, setHistory] = useState([]);
//   const [cartAmount, setCartAmount] = useState(0);
//   const [profileDetail, setProfileDetail] = useState();
//   const [cartProducts, setCartProducts] = useState(() => {
//     if (typeof window !== "undefined" && window.localStorage) {
//       const savedCart = localStorage.getItem("cartProducts");
//       return savedCart ? JSON.parse(savedCart) : [];
//     }
//     return [];
//   });

//   // Load token from AsyncStorage on app start
//   // useEffect(() => {
//   //   const loadToken = async () => {
//   //     try {
//   //       const savedToken = await AsyncStorage.getItem('authToken');
//   //       if (savedToken) {
//   //         setToken(savedToken);
//   //         setIsLogin(true); // Assume user is logged in if token exists
//   //       }
//   //     } catch (error) {
//   //       console.error('Error loading token:', error);
//   //     }
//   //   };
//   //   loadToken();
//   // }, []);

//   // Save cartProducts to localStorage
//   useEffect(() => {
//     if (typeof window !== "undefined" && window.localStorage) {
//       if (cartProducts.length > 0) {
//         localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
//       }
//     }
//   }, [cartProducts]);

//   return (
//     <AuthContext.Provider
//       value={{
//         isLogin,
//         setIsLogin,
//         userId,
//         setUserId,
//         token, // Add token to context
//         setToken, // Add setToken to context
//         cartProducts,
//         setCartProducts,
//         amount,
//         setAmount,
//         history,
//         setHistory,
//         cartAmount,
//         setCartAmount,
//         profileDetail,
//         setProfileDetail,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


// import React, { createContext, useState, useContext, useEffect } from "react";
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLogin, setIsLogin] = useState(false);
//   const [userId, setUserId] = useState("");
//   const [token, setToken] = useState(null);
//   const [amount, setAmount] = useState("0"); // Initialize as string to match Wallet usage
//   const [history, setHistory] = useState([]);
//   const [cartAmount, setCartAmount] = useState(0);
//   const [profileDetail, setProfileDetail] = useState();
//   const [cartProducts, setCartProducts] = useState([]);

//   // Load data from AsyncStorage on app start
//   useEffect(() => {
//     const loadStoredData = async () => {
//       try {
//         // Load token
//         // const savedToken = await AsyncStorage.getItem('authToken');
//         // if (savedToken) {
//         //   setToken(savedToken);
//         //   setIsLogin(true);
//         // }

//         // Load cartProducts
//         const savedCart = await AsyncStorage.getItem('cartProducts');
//         if (savedCart) {
//           setCartProducts(JSON.parse(savedCart));
//         }

//         // Load wallet amount and history (optional, if stored)
//         const savedAmount = await AsyncStorage.getItem('walletAmount');
//         if (savedAmount) {
//           setAmount(savedAmount);
//         }
//         const savedHistory = await AsyncStorage.getItem('walletHistory');
//         if (savedHistory) {
//           setHistory(JSON.parse(savedHistory));
//         }
//       } catch (error) {
//         console.error('Error loading data from AsyncStorage:', error);
//       }
//     };
//     loadStoredData();
//   }, []);

//   // Save cartProducts to AsyncStorage whenever cartProducts changes
//   useEffect(() => {
//     const saveCartProducts = async () => {
//       try {
//         if (cartProducts.length > 0) {
//           await AsyncStorage.setItem('cartProducts', JSON.stringify(cartProducts));
//         } else {
//           await AsyncStorage.removeItem('cartProducts');
//         }
//       } catch (error) {
//         console.error('Error saving cartProducts to AsyncStorage:', error);
//       }
//     };
//     saveCartProducts();
//   }, [cartProducts]);

//   // Save wallet amount and history to AsyncStorage
//   useEffect(() => {
//     const saveWalletData = async () => {
//       try {
//         await AsyncStorage.setItem('walletAmount', amount.toString());
//         await AsyncStorage.setItem('walletHistory', JSON.stringify(history));
//       } catch (error) {
//         console.error('Error saving wallet data to AsyncStorage:', error);
//       }
//     };
//     saveWalletData();
//   }, [amount, history]);

//   return (
//     <AuthContext.Provider
//       value={{
//         isLogin,
//         setIsLogin,
//         userId,
//         setUserId,
//         token,
//         setToken,
//         cartProducts,
//         setCartProducts,
//         amount,
//         setAmount,
//         history,
//         setHistory,
//         cartAmount,
//         setCartAmount,
//         profileDetail,
//         setProfileDetail,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);





import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState(null);
  const [amount, setAmount] = useState("0");
  const [history, setHistory] = useState([]);
  const [cartAmount, setCartAmount] = useState(0);
  const [profileDetail, setProfileDetail] = useState();
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('authToken');
        console.log('Loaded token from AsyncStorage:', savedToken); // Debug
        // if (savedToken) {
        //   setToken(savedToken);
        //   setIsLogin(true);
        // } else {
        //   console.log('No token found in AsyncStorage');
        // }

        const savedCart = await AsyncStorage.getItem('cartProducts');
        if (savedCart) {
          setCartProducts(JSON.parse(savedCart));
        }

        const savedAmount = await AsyncStorage.getItem('walletAmount');
        if (savedAmount) {
          setAmount(savedAmount);
        }
        const savedHistory = await AsyncStorage.getItem('walletHistory');
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };
    loadStoredData();
  }, []);

  useEffect(() => {
    const saveCartProducts = async () => {
      try {
        if (cartProducts.length > 0) {
          await AsyncStorage.setItem('cartProducts', JSON.stringify(cartProducts));
        } else {
          await AsyncStorage.removeItem('cartProducts');
        }
      } catch (error) {
        console.error('Error saving cartProducts to AsyncStorage:', error);
      }
    };
    saveCartProducts();
  }, [cartProducts]);

  useEffect(() => {
    const saveWalletData = async () => {
      try {
        await AsyncStorage.setItem('walletAmount', amount.toString());
        await AsyncStorage.setItem('walletHistory', JSON.stringify(history));
      } catch (error) {
        console.error('Error saving wallet data to AsyncStorage:', error);
      }
    };
    saveWalletData();
  }, [amount, history]);

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        setIsLogin,
        userId,
        setUserId,
        token,
        setToken,
        cartProducts,
        setCartProducts,
        amount,
        setAmount,
        history,
        setHistory,
        cartAmount,
        setCartAmount,
        profileDetail,
        setProfileDetail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);