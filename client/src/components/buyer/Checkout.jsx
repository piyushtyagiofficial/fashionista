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

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
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
            await api.put(`/orders/${orderId}/pay`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            clearCart();
            toast.success("Payment successful!");
            navigate("/buyer/orders");
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || "",
        },
        theme: {
          color: "#3b44ac",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      toast.error("Failed to initiate payment");
      console.error("Payment error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

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

      const response = await api.post("/orders", orderData);
      await handlePayment(response.data._id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create order");
      toast.error("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => navigate("/")} className="btn btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
            </form>
          </div>
        </div>

        <div className="md:w-1/3">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item._id}-${item.size}-${item.color}`}
                  className="flex justify-between"
                >
                  <span className="text-gray-600">
                    {item.name} x {item.qty}
                  </span>
                  <span className="font-medium">
                    ₹{((item.salePrice || item.price) * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>₹{(cartTotal * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total</span>
                  <span>₹{(cartTotal + cartTotal * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full btn btn-primary flex items-center justify-center gap-2"
                disabled={loading}
              >
                <FaLock />
                {loading ? "Processing..." : "Place Order"}
              </button>

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Secure payment powered by Razorpay</p>
                <div className="flex justify-center mt-2 space-x-2">
                  <img
                    src="https://img.icons8.com/ios-filled/50/000000/rupee.png"
                    alt="UPI"
                    className="h-6"
                  />
                  <img
                    src="https://img.icons8.com/ios-filled/50/000000/bank-building.png"
                    alt="Net Banking"
                    className="h-6"
                  />
                  <img
                    src="https://img.icons8.com/ios-filled/50/000000/bank-card-back-side.png"
                    alt="Cards"
                    className="h-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
