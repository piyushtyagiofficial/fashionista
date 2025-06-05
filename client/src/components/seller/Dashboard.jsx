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
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
        <Link
          to="/seller/products/new"
          className="btn btn-primary flex items-center gap-2"
        >
          <FaPlus /> Add New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-light/10 rounded-full">
              <FaBox className="text-2xl text-primary-main" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-light/10 rounded-full">
              <FaShoppingBag className="text-2xl text-secondary-main" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-success-light/10 rounded-full">
              <FaChartLine className="text-2xl text-success-main" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Products</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="py-3 px-4">{order._id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{order.products}</td>
                    <td className="py-3 px-4">${order.total.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'completed' ? 'bg-success-light text-success-dark' :
                        order.status === 'pending' ? 'bg-warning-light text-warning-dark' :
                        'bg-error-light text-error-dark'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;