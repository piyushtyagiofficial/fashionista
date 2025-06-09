import { useState, useEffect } from "react";
import { useAuth } from "../context/auth/AuthContext";
import { FaSearch, FaEye, FaDownload } from "react-icons/fa";
import Loader from "../components/common/Loader";
import api from "../utils/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const endpoint =
          user?.role === "seller" ? "/orders/seller" : "/orders/myorders";
        const response = await api.get(endpoint);
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setSelectedOrder(response.data);
      setShowDetails(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "ordered":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const downloadPDF = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Order Details", 14, 20);

    // Basic Info
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 14, 30);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 38);
    doc.text(`Status: ${order.status}`, 14, 46);

    // Shipping Info
    doc.text("Shipping Address:", 14, 58);
    const { address, city, postalCode, country } = order.shippingAddress || {};
    doc.text(`${address}, ${city}, ${postalCode}, ${country}`, 14, 66);

    // Price Summary
    doc.text("Order Summary:", 14, 78);
    const itemsPrice = (
      order.totalPrice -
      order.taxPrice -
      order.shippingPrice
    ).toFixed(2);
    doc.text(`Items: Rs. ${itemsPrice}`, 14, 86);
    doc.text(`Tax: Rs. ${order.taxPrice}`, 14, 94);
    doc.text(`Shipping: Rs. ${order.shippingPrice}`, 14, 102);
    doc.text(`Total: Rs. ${order.totalPrice}`, 14, 110);

    // Order Items Table
    autoTable(doc, {
      startY: 120,
      head: [["Item", "Size", "Color", "Qty", "Price"]],
      body: order.orderItems.map((item) => [
        item.name,
        item.size,
        item.color,
        item.qty,
        `Rs. ${item.price.toFixed(2)}`,
      ]),
    });

    doc.save(`Order_${order._id}.pdf`);
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-400">
              {user?.role === "seller" ? "Manage Orders" : "My Orders"}
            </h1>

            <div className="relative w-full max-w-xs">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No orders found</div>
        ) : (
          <div className="overflow-x-auto rounded-md shadow-md">
            <table className="w-full border-collapse border border-gray-700">
              <thead className="bg-gray-900 text-gray-400">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-700">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-700">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-700">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700 text-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-sm">
                      ₹{order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => fetchOrderDetails(order._id)}
                          className="flex items-center justify-center text-primary-400 hover:text-primary-600 transition duration-200"
                          title="View Details"
                        >
                          <FaEye className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => downloadPDF(order)}
                          className="flex items-center gap-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-md text-xs sm:text-sm transition duration-200"
                          title="Download PDF"
                        >
                          <FaDownload className="w-4 h-4" />
                          <span className="hidden sm:inline">Invoice</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Order Details Modal */}
        {showDetails && selectedOrder && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/70 flex items-center justify-center p-4 z-50">
            <div
              className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn text-gray-200"
              style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)" }}
            >
              <div className="relative p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold tracking-wide">Order Details</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-4xl font-bold text-gray-500 hover:text-gray-300 transition duration-300"
                    aria-label="Close modal"
                  >
                    &times;
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Shipping Information
                      </h3>
                      <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl space-y-1 text-sm shadow-inner">
                        <p>{selectedOrder.shippingAddress.address}</p>
                        <p>{selectedOrder.shippingAddress.city}</p>
                        <p>{selectedOrder.shippingAddress.postalCode}</p>
                        <p>{selectedOrder.shippingAddress.country}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                      <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl space-y-3 text-sm shadow-inner">
                        <div className="flex justify-between">
                          <span>Items Price:</span>
                          <span>
                            ₹
                            {selectedOrder.totalPrice -
                              selectedOrder.taxPrice -
                              selectedOrder.shippingPrice}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>₹{selectedOrder.taxPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>₹{selectedOrder.shippingPrice}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-700 mt-3">
                          <span>Total:</span>
                          <span>₹{selectedOrder.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {selectedOrder.orderItems.map((item) => (
                        <div
                          key={`${item._id}-${item.size}-${item.color}`}
                          className="flex items-center gap-6 p-4 rounded-xl border border-gray-700 bg-gray-800 shadow-md"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-lg border border-gray-600 shadow-sm"
                          />
                          <div className="flex-1 space-y-1 text-sm text-gray-300">
                            <h4 className="font-semibold text-base">{item.name}</h4>
                            <p>
                              Size: {item.size} | Color: {item.color}
                            </p>
                            <p>Quantity: {item.qty}</p>
                          </div>
                          <div className="text-right font-semibold text-base text-white">
                            ₹{item.price.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;