import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingBag, FaChartLine, FaPlus } from 'react-icons/fa';
import { useAuth } from '../../context/auth/AuthContext';
import Loader from '../common/Loader';
import api from '../../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch seller's products
        const productsResponse = await api.get('/products/seller/products');
        const products = productsResponse.data || [];

        // Fetch seller's orders
        const ordersResponse = await api.get('/orders/seller');
        const orders = ordersResponse.data || [];

        // Calculate stats
        const totalRevenue = orders.reduce((total, order) => {
          return total + order.totalPrice;
        }, 0);

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue,
          recentOrders: orders.slice(0, 5).map(order => ({
            _id: order._id,
            customer: order.user?.name || 'Anonymous',
            products: order.orderItems.length,
            total: order.totalPrice,
            status: order.status,
            createdAt: order.createdAt
          }))
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="p-4 bg-red-600 text-white rounded-lg text-center">
        {error}
      </div>
    );
  }

  return (
    <div className='bg-black'>
   <div className="bg-black text-white">
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
          <Link
            to="/seller/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
          >
            <FaPlus /> Add New Product
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Products', value: stats.totalProducts, icon: <FaBox />, color: 'bg-gray-600' },
            { label: 'Total Orders', value: stats.totalOrders, icon: <FaShoppingBag />, color: 'bg-gray-600' },
            { label: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(2)}`, icon: <FaChartLine />, color: 'bg-gray-600' },
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-lg shadow-sm border border-gray-600 bg-gray-700">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-400">{item.label}</p>
                  <h3 className="text-2xl font-bold text-white">{item.value}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-gray-700 rounded-lg shadow-sm p-6 border border-gray-600">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
              <thead>
                <tr className="border-b border-gray-600 text-gray-400">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Products</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-600">
                      <td className="py-3 px-4">{order._id}</td>
                      <td className="py-3 px-4">{order.customer}</td>
                      <td className="py-3 px-4">{order.products}</td>
                      <td className="py-3 px-4">₹{order.total.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'completed' ? 'bg-green-600 text-white' :
                          order.status === 'pending' ? 'bg-yellow-600 text-white' :
                          order.status === 'cancelled' ? 'bg-red-600 text-white' :
                          'bg-blue-600 text-white'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-400">
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;