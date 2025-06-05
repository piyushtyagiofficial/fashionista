import { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setError(null);
    
    const existingItem = cartItems.find(
      (x) => x._id === item._id && x.size === item.size && x.color === item.color
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((x) =>
          x._id === item._id && x.size === item.size && x.color === item.color
            ? { ...x, qty: x.qty + item.qty }
            : x
        )
      );
    } else {
      setCartItems([...cartItems, item]);
    }
  };

  const removeFromCart = (id, size, color) => {
    setError(null);
    setCartItems(
      cartItems.filter((x) => !(x._id === id && x.size === size && x.color === color))
    );
  };

  const updateCartQuantity = (id, size, color, qty) => {
    setError(null);
    if (qty < 1) return;
    
    setCartItems(
      cartItems.map((x) =>
        x._id === id && x.size === size && x.color === color ? { ...x, qty } : x
      )
    );
  };

  const clearCart = () => {
    setError(null);
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.salePrice > 0 ? item.salePrice : item.price;
    return total + price * item.qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount: cartItems.reduce((acc, item) => acc + item.qty, 0),
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};