import { useCart } from '../../context/cart/CartContext';
import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Cart() {
  const { cartItems, removeFromCart, updateCartQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some items to your cart to get started!</p>
        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          {cartItems.map((item) => (
            <motion.div
              key={`${item._id}-${item.size}-${item.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-4 border-b py-4"
            >
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-600 text-sm">
                  Size: {item.size} | Color: {item.color}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateCartQuantity(item._id, item.size, item.color, Math.max(1, item.qty - 1))}
                    className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                    disabled={item.qty <= 1}
                  >
                    <FaMinus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateCartQuantity(item._id, item.size, item.color, item.qty + 1)}
                    className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    <FaPlus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-medium">
                  ₹{((item.salePrice || item.price) * item.qty).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item._id, item.size, item.color)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Order Summary</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="btn btn-primary w-full text-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;