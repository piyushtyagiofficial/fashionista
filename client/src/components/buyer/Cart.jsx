import { useCart } from '../../context/cart/CartContext';
import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Cart() {
  const { cartItems, removeFromCart, updateCartQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-black text-gray-300 px-4">
        <h2 className="text-3xl font-bold mb-4 text-cyan-400">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">Add some items to your cart to get started!</p>
        <Link
          to="/products"
          className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-3 rounded shadow transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className=" bg-black">
    <div className=" bg-black text-gray-300 px-4 py-12">
      <div className=" mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3 space-y-6">
            {cartItems.map((item) => (
              <motion.div
                key={`${item._id}-${item.size}-${item.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-4 border-b border-gray-700 pb-4"
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded shadow-lg"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-cyan-400">{item.name}</h3>
                  <p className="text-gray-500 text-sm">
                    Size: <span className="text-gray-300">{item.size}</span> | Color: <span className="text-gray-300">{item.color}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() =>
                        updateCartQuantity(
                          item._id,
                          item.size,
                          item.color,
                          Math.max(1, item.qty - 1)
                        )
                      }
                      className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item.qty <= 1}
                      aria-label="Decrease quantity"
                    >
                      <FaMinus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-gray-300">{item.qty}</span>
                    <button
                      onClick={() =>
                        updateCartQuantity(item._id, item.size, item.color, item.qty + 1)
                      }
                      className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-cyan-400"
                      aria-label="Increase quantity"
                    >
                      <FaPlus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-cyan-400 text-lg">
                    ₹{((item.salePrice || item.price) * item.qty).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item._id, item.size, item.color)}
                    className="text-red-600 hover:text-red-800 mt-2"
                    aria-label="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 bg-gray-900 rounded-lg p-6 shadow-lg text-gray-200">
            <h3 className="text-xl font-bold mb-6 text-cyan-400">Order Summary</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-green-500">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-700 pt-3 text-cyan-400">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-center py-3 rounded shadow transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>  );
}

export default Cart;