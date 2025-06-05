import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth/AuthContext';
import { ProductList } from '../components/buyer/ProductList';
import { FaHeart, FaShoppingBag, FaUser, FaBox, FaChartLine, FaCalendarAlt, FaHistory, FaClock } from 'react-icons/fa';
import api from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';

function BuyerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [wishlistItems, setWishlistItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    last7Days: 0,
    lastMonth: 0,
    totalOrders: 0,
    wishlistCount: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersResponse, wishlistResponse] = await Promise.all([
        api.get('/orders/myorders'),
        api.get('/auth/wishlist')
      ]);

      const orders = ordersResponse.data;
      const wishlist = wishlistResponse.data.wishlist;

      // Calculate stats
      const now = new Date();
      const last7Days = new Date(now.setDate(now.getDate() - 7));
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1));

      const ordersLast7Days = orders.filter(order => 
        new Date(order.createdAt) >= last7Days
      ).length;

      const ordersLastMonth = orders.filter(order => 
        new Date(order.createdAt) >= lastMonth
      ).length;

      setStats({
        last7Days: ordersLast7Days,
        lastMonth: ordersLastMonth,
        totalOrders: orders.length,
        wishlistCount: wishlist.length
      });

      setRecentOrders(orders.slice(0, 5));
      setWishlistItems(wishlist);
    } catch (error) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) return <Loader />;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-100 rounded-full">
                    <FaClock className="text-xl text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last 7 Days</p>
                    <h3 className="text-2xl font-bold">{stats.last7Days} Orders</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary-100 rounded-full">
                    <FaCalendarAlt className="text-xl text-secondary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Month</p>
                    <h3 className="text-2xl font-bold">{stats.lastMonth} Orders</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-success-light rounded-full">
                    <FaHistory className="text-xl text-success-main" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-error-light rounded-full">
                    <FaHeart className="text-xl text-error-main" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Wishlist Items</p>
                    <h3 className="text-2xl font-bold">{stats.wishlistCount}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Order ID</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Total</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="border-b">
                        <td className="py-3 px-4">{order._id}</td>
                        <td className="py-3 px-4">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">${order.totalPrice.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'ordered' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
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
      case 'products':
        return <ProductList />;
      case 'wishlist':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.length > 0 ? (
              wishlistItems.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
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
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FaUser className="text-2xl text-primary-600" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                activeTab === 'overview'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaChartLine />
              <span className="hidden sm:inline">Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                activeTab === 'products'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaShoppingBag />
              <span className="hidden sm:inline">Products</span>
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                activeTab === 'wishlist'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaHeart />
              <span className="hidden sm:inline">Wishlist</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {renderContent()}
      </div>
    </div>
  );
}

export default BuyerDashboard;