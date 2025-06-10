import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart/CartContext";
import { useAuth } from "../../context/auth/AuthContext";
import { FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../utils/api";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    address: user?.address?.street || "",
    city: user?.address?.city || "",
    postalCode: user?.address?.postalCode || "",
    country: user?.address?.country || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateShippingInfo = () => {
    const { address, city, postalCode, country } = shippingInfo;
    
    if (!address.trim()) {
      toast.error("Please enter your address");
      return false;
    }
    if (!city.trim()) {
      toast.error("Please enter your city");
      return false;
    }
    if (!postalCode.trim()) {
      toast.error("Please enter your postal code");
      return false;
    }
    if (!country.trim()) {
      toast.error("Please enter your country");
      return false;
    }
    
    return true;
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const updateProductStock = async () => {
    try {
      console.log('Starting stock update for cart items:', cartItems);

      // Group cart items by product ID and aggregate quantities by size
      const productUpdates = {};

      cartItems.forEach(item => {
        const productId = item._id;
        const size = item.size;
        const quantity = item.qty;

        console.log(`Processing item: ${item.name}, Size: ${size}, Qty: ${quantity}`);

        if (!productUpdates[productId]) {
          productUpdates[productId] = {};
        }

        if (!productUpdates[productId][size]) {
          productUpdates[productId][size] = 0;
        }

        // Add the quantity for this size
        productUpdates[productId][size] += quantity;
      });

      console.log('Grouped product updates:', productUpdates);

      // Update stock for each product
      const updatePromises = Object.entries(productUpdates).map(([productId, sizeQuantities]) => {
        const purchasedSizes = Object.entries(sizeQuantities).map(([size, totalQuantity]) => ({
          size,
          quantity: totalQuantity
        }));

        console.log(`Updating stock for product ${productId}:`, purchasedSizes);

        return api.put(`/products/${productId}/stock`, { purchasedSizes });
      });

      await Promise.all(updatePromises);
      console.log('Stock updated successfully for all products');

    } catch (error) {
      console.error('Failed to update stock:', error);
      // Don't throw error here as payment was successful
      toast.warning('Payment successful but stock update failed. Please contact support.');
    }
  };

  const handlePayment = async (orderId) => {
    const res = await initializeRazorpay();

    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    try {
      const result = await api.post("/orders/create-payment", {
        amount: Math.round(cartTotal * 100), // Convert to paise
      });

      const { amount, id: order_id, currency } = result.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: currency,
        name: "Fashionista",
        description: "Thank you for shopping with us",
        order_id: order_id,
        handler: async (response) => {
          try {
            // Verify payment first
            await api.put(`/orders/${orderId}/pay`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            console.log('Payment verified successfully, now updating stock...');

            // Update product stock ONLY after successful payment verification
            await updateProductStock();

            // Clear cart and redirect
            clearCart();
            toast.success("Payment successful! Your order has been placed.");
            navigate("/buyer/orders");
          } catch (err) {
            console.error('Payment verification failed:', err);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || "",
        },
        theme: {
          color: "#12D8FA", // Changed to match the new color scheme
        },
        modal: {
          ondismiss: function() {
            toast.info("Payment cancelled");
            setLoading(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      toast.error("Failed to initiate payment");
      console.error("Payment error:", err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate shipping information first
    if (!validateShippingInfo()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Validate cart items stock before creating order
      for (const item of cartItems) {
        try {
          const response = await api.get(`/products/${item._id}`);
          const product = response.data;
          const sizeData = product.sizes.find(s => s.size === item.size);

          if (!sizeData || sizeData.countInStock < item.qty) {
            throw new Error(`Insufficient stock for ${item.name} (Size: ${item.size}). Only ${sizeData?.countInStock || 0} available.`);
          }
        } catch (stockError) {
          setError(stockError.message);
          toast.error(stockError.message);
          setLoading(false);
          return;
        }
      }

      console.log('Creating order with cart items:', cartItems);

      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.images[0],
          price: item.salePrice || item.price,
          size: item.size,
          color: item.color,
          product: item._id,
          seller: item.seller,
        })),
        shippingAddress: shippingInfo,
        paymentMethod: "razorpay",
        itemsPrice: cartTotal,
        shippingPrice: 0,
        taxPrice: cartTotal * 0.1,
        totalPrice: cartTotal + cartTotal * 0.1,
      };

      console.log('Order data being sent:', orderData);

      const response = await api.post("/orders", orderData);
      console.log('Order created successfully:', response.data._id);

      await handlePayment(response.data._id);
    } catch (err) {
      console.error('Order creation failed:', err);
      setError(err.response?.data?.message || "Failed to create order");
      toast.error("Failed to create order");
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center py-12 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-transparent font-serif">
          Your Cart is Empty
        </h2>
        <p className="text-gray-400 mb-8 text-lg">
          Looks like you haven't added anything to your cart yet.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-gray-900 px-8 py-3 rounded-md font-bold hover:from-[#A6FFCB] hover:to-[#1FA2FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1FA2FF] transition-all duration-300 transform hover:scale-105"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-transparent font-serif">
        Secure Checkout
      </h1>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6 text-center text-sm">
          {error}
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Shipping Information Card */}
        <div className="md:col-span-2 bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-gray-200 mb-6 border-b border-gray-700 pb-4">
            Shipping Information
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-2">
                Street Address <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-[#12D8FA] focus:ring-[#12D8FA] placeholder-gray-500 p-3"
                placeholder="Enter your street address"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-400 mb-2">
                  City <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-[#12D8FA] focus:ring-[#12D8FA] placeholder-gray-500 p-3"
                  placeholder="Enter your city"
                  required
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-400 mb-2">
                  Postal Code <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-[#12D8FA] focus:ring-[#12D8FA] placeholder-gray-500 p-3"
                  placeholder="Enter postal code"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-400 mb-2">
                Country <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={shippingInfo.country}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-[#12D8FA] focus:ring-[#12D8FA] placeholder-gray-500 p-3"
                placeholder="Enter your country"
                required
              />
            </div>
          </form>
        </div>

        {/* Order Summary Card */}
        <div className="md:col-span-1 bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-gray-200 mb-6 border-b border-gray-700 pb-4">
            Order Summary
          </h2>
          <div className="space-y-4 text-gray-300">
            {cartItems.map((item) => (
              <div
                key={`${item._id}-${item.size}-${item.color}`}
                className="flex justify-between items-center text-sm"
              >
                <span className="truncate pr-2">
                  {item.name} x {item.qty} ({item.size}, {item.color})
                </span>
                <span className="font-semibold text-white">
                  ₹{((item.salePrice || item.price) * item.qty).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="border-t border-gray-700 pt-4 mt-4 space-y-3 text-lg">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-white">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span className="font-semibold text-white">₹{(cartTotal * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-semibold text-white">Free</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-white pt-2 border-t border-gray-700 mt-3">
                <span>Total:</span>
                <span>₹{(cartTotal + cartTotal * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full mt-8 ${
                loading
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-gray-900 hover:from-[#A6FFCB] hover:to-[#1FA2FF] transform hover:scale-105"
              } px-6 py-4 rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1FA2FF] transition-all duration-300 flex items-center justify-center gap-3`}
            >
              <FaLock className="text-xl" />
              {loading ? "Processing Order..." : "Place Secure Order"}
            </button>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Secure payment powered by Razorpay.</p>
              <div className="flex justify-center mt-3 space-x-4">
                <img
                  src="https://img.icons8.com/ios-filled/50/a6ffcb/rupee.png"
                  alt="UPI"
                  className="h-8 opacity-80"
                />
                <img
                  src="https://img.icons8.com/ios-filled/50/a6ffcb/bank-building.png"
                  alt="Net Banking"
                  className="h-8 opacity-80"
                />
                <img
                  src="https://img.icons8.com/ios-filled/50/a6ffcb/bank-card-back-side.png"
                  alt="Cards"
                  className="h-8 opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;