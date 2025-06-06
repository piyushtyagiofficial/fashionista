import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api'; 

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
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart items:', error);
        localStorage.removeItem('cartItems');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const checkStock = async (productId, size, requestedQty) => {
    try {
      const response = await api.get(`/products/${productId}`);
      const product = response.data;
      const sizeData = product.sizes.find(s => s.size === size);
      
      if (!sizeData) {
        throw new Error('Size not found');
      }
      
      return sizeData.countInStock >= requestedQty;
    } catch (error) {
      console.error('Error checking stock:', error);
      return false;
    }
  };

  const addToCart = async (item) => {
    setError(null);
    
    try {
      // Check stock before adding
      const hasStock = await checkStock(item._id, item.size, item.qty);
      if (!hasStock) {
        toast.error('Insufficient stock for this item');
        return;
      }

      const existingItem = cartItems.find(
        (x) => x._id === item._id && x.size === item.size && x.color === item.color
      );

      if (existingItem) {
        const newQty = existingItem.qty + item.qty;
        const hasStockForNewQty = await checkStock(item._id, item.size, newQty);
        
        if (!hasStockForNewQty) {
          toast.error(`Only ${existingItem.qty} more items available in stock`);
          return;
        }

        setCartItems(
          cartItems.map((x) =>
            x._id === item._id && x.size === item.size && x.color === item.color
              ? { ...x, qty: newQty }
              : x
          )
        );
      } else {
        setCartItems([...cartItems, item]);
      }
    } catch (error) {
      setError('Failed to add item to cart');
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = (id, size, color) => {
    setError(null);
    setCartItems(
      cartItems.filter((x) => !(x._id === id && x.size === size && x.color === color))
    );
  };

  const updateCartQuantity = async (id, size, color, qty) => {
    setError(null);
    if (qty < 1) return;
    
    try {
      // Check stock before updating
      const hasStock = await checkStock(id, size, qty);
      if (!hasStock) {
        toast.error('Insufficient stock for requested quantity');
        return;
      }

      setCartItems(
        cartItems.map((x) =>
          x._id === id && x.size === size && x.color === color ? { ...x, qty } : x
        )
      );
    } catch (error) {
      setError('Failed to update cart');
      toast.error('Failed to update cart');
    }
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