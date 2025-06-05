import { useState, useEffect } from "react";
import { useAuth } from "../context/auth/AuthContext";
import { FaSearch, FaEye } from "react-icons/fa";
import Loader from "../components/common/Loader";
import api from "../utils/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaDownload } from "react-icons/fa";

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
    doc.text(`Items: $${itemsPrice}`, 14, 86);
    doc.text(`Tax: $${order.taxPrice}`, 14, 94);
    doc.text(`Shipping: $${order.shippingPrice}`, 14, 102);
    doc.text(`Total: $${order.totalPrice}`, 14, 110);

    // Order Items Table
    autoTable(doc, {
      startY: 120,
      head: [["Item", "Size", "Color", "Qty", "Price"]],
      body: order.orderItems.map((item) => [
        item.name,
        item.size,
        item.color,
        item.qty,
        `$${item.price.toFixed(2)}`,
      ]),
    });

    doc.save(`Order_${order._id}.pdf`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold">
              {user?.role === "seller" ? "Manage Orders" : "My Orders"}
            </h1>

            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {order._id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        ${order.totalPrice.toFixed(2)}
                      </span>
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
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => fetchOrderDetails(order._id)}
                          className="flex items-center justify-center text-blue-600 hover:text-blue-800 transition"
                          title="View Details"
                        >
                          <FaEye className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => downloadPDF(order)}
                          className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded-md text-xs sm:text-sm transition duration-200"
                          title="Download PDF"
                        >
                          <FaDownload className="w-4 h-4" />
                          <span className="hidden sm:inline">PDF</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Shipping Information</h3>
                    <div className="bg-gray-50 p-4 rounded">
                      <p>{selectedOrder.shippingAddress.address}</p>
                      <p>{selectedOrder.shippingAddress.city}</p>
                      <p>{selectedOrder.shippingAddress.postalCode}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Order Summary</h3>
                    <div className="bg-gray-50 p-4 rounded">
                      <p>
                        Items Price: $
                        {selectedOrder.totalPrice -
                          selectedOrder.taxPrice -
                          selectedOrder.shippingPrice}
                      </p>
                      <p>Tax: ${selectedOrder.taxPrice}</p>
                      <p>Shipping: ${selectedOrder.shippingPrice}</p>
                      <p className="font-bold mt-2">
                        Total: ${selectedOrder.totalPrice}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.orderItems.map((item) => (
                      <div
                        key={`${item._id}-${item.size}-${item.color}`}
                        className="flex items-center gap-4 border-b pb-4"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            Size: {item.size} | Color: {item.color}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.qty}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ${item.price.toFixed(2)}
                          </p>
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
  );
};

export default OrdersPage;
