import { useState, useEffect } from "react";
import { useAuth } from "../context/auth/AuthContext";
import { ProductList } from "../components/buyer/ProductList";
import {
  FaHeart,
  FaShoppingBag,
  FaUser,
  FaBox,
  FaChartLine,
  FaCalendarAlt,
  FaHistory,
  FaClock,
} from "react-icons/fa";
import api from "../utils/api";
import ProductCard from "../components/common/ProductCard";
import Loader from "../components/common/Loader";

function BuyerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [wishlistItems, setWishlistItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    last7Days: 0,
    lastMonth: 0,
    totalOrders: 0,
    wishlistCount: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersResponse, wishlistResponse] = await Promise.all([
        api.get("/orders/myorders"),
        api.get("/auth/wishlist"),
      ]);

      const orders = ordersResponse.data;
      const wishlist = wishlistResponse.data.wishlist;

      // Calculate stats
      const now = new Date();
      const last7Days = new Date(now.setDate(now.getDate() - 7));
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1));

      const ordersLast7Days = orders.filter(
        (order) => new Date(order.createdAt) >= last7Days
      ).length;

      const ordersLastMonth = orders.filter(
        (order) => new Date(order.createdAt) >= lastMonth
      ).length;

      setStats({
        last7Days: ordersLast7Days,
        lastMonth: ordersLastMonth,
        totalOrders: orders.length,
        wishlistCount: wishlist.length,
      });

      setRecentOrders(orders.slice(0, 5));
      setWishlistItems(wishlist);
    } catch (error) {
      setError("Failed to fetch dashboard data");
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) return <Loader />;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Last 7 Days",
                  value: stats.last7Days + " Orders",
                  icon: <FaClock className="text-blue-400 text-xl" />,
                  bg: "bg-blue-900",
                },
                {
                  label: "Last Month",
                  value: stats.lastMonth + " Orders",
                  icon: <FaCalendarAlt className="text-purple-400 text-xl" />,
                  bg: "bg-purple-900",
                },
                {
                  label: "Total Orders",
                  value: stats.totalOrders,
                  icon: <FaHistory className="text-green-400 text-xl" />,
                  bg: "bg-green-900",
                },
                {
                  label: "Wishlist Items",
                  value: stats.wishlistCount,
                  icon: <FaHeart className="text-pink-400 text-xl" />,
                  bg: "bg-pink-900",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${item.bg}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{item.label}</p>
                      <h3 className="text-2xl font-bold text-white">
                        {item.value}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-600">
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                  <thead>
                    <tr className="border-b border-gray-600 text-gray-400">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-600">
                        <td className="py-3 px-4">{order._id}</td>
                        <td className="py-3 px-4">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          ₹{order.totalPrice.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.status === "delivered"
                                ? "bg-green-600 text-white"
                                : order.status === "ordered"
                                ? "bg-yellow-600 text-white"
                                : order.status === "cancelled"
                                ? "bg-red-600 text-white"
                                : "bg-blue-600 text-white"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "products":
        return <ProductList />;
      case "wishlist":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.length > 0 ? (
              wishlistItems.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400">
                Your wishlist is empty
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className=" bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="text-2xl text-[#12D8FA]" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <p className="text-gray-400">{user?.email}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                  activeTab === "overview"
                    ? "bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-gray-900 rounded-lg font-bold hover:from-[#A6FFCB] hover:to-[#1FA2FF] text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              >
                <FaChartLine />
                <span className="hidden sm:inline">Overview</span>
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                  activeTab === "products"
                    ? "bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-gray-900 rounded-lg font-bold hover:from-[#A6FFCB] hover:to-[#1FA2FF] text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              >
                <FaShoppingBag />
                <span className="hidden sm:inline">Products</span>
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                  activeTab === "wishlist"
                    ? "bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-gray-900 rounded-lg font-bold hover:from-[#A6FFCB] hover:to-[#1FA2FF] text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              >
                <FaHeart />
                <span className="hidden sm:inline">Wishlist</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-sm p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default BuyerDashboard;
