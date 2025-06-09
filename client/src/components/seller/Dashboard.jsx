import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingBag, FaChartLine, FaPlus, FaDollarSign, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { useAuth } from '../../context/auth/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FiTrendingUp } from 'react-icons/fi';
import { format, subDays, subWeeks, subMonths, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import Loader from '../common/Loader';
import api from '../../utils/api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    paidRevenue: 0,
    recentOrders: [],
    chartData: {
      revenue: [],
      orders: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const [chartType, setChartType] = useState('revenue'); // revenue, orders

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

        // Filter only paid/ordered orders for revenue calculation
        const paidOrders = orders.filter(order => 
          order.isPaid || order.status === 'ordered' || order.status === 'shipped' || order.status === 'delivered'
        );

        // Calculate total revenue from paid orders only
        const paidRevenue = paidOrders.reduce((total, order) => {
          return total + (order.totalPrice || 0);
        }, 0);

        // Calculate total revenue (including pending)
        const totalRevenue = orders.reduce((total, order) => {
          return total + (order.totalPrice || 0);
        }, 0);

        // Generate chart data based on time range
        const chartData = generateChartData(paidOrders, timeRange);

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue,
          paidRevenue,
          recentOrders: orders.slice(0, 5).map(order => ({
            _id: order._id,
            customer: order.user?.name || 'Anonymous',
            products: order.orderItems.length,
            total: order.totalPrice,
            status: order.status,
            isPaid: order.isPaid,
            createdAt: order.createdAt
          })),
          chartData
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [timeRange]);

  const generateChartData = (orders, range) => {
    const now = new Date();
    let periods = [];
    let labels = [];

    // Generate periods based on time range
    if (range === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = subDays(now, i);
        periods.push({
          start: startOfDay(date),
          end: endOfDay(date),
          label: format(date, 'EEE')
        });
      }
    } else if (range === 'month') {
      for (let i = 3; i >= 0; i--) {
        const date = subWeeks(now, i);
        periods.push({
          start: startOfWeek(date),
          end: endOfWeek(date),
          label: `Week ${4 - i}`
        });
      }
    } else if (range === 'year') {
      for (let i = 11; i >= 0; i--) {
        const date = subMonths(now, i);
        periods.push({
          start: startOfMonth(date),
          end: endOfMonth(date),
          label: format(date, 'MMM')
        });
      }
    }

    // Calculate revenue and order count for each period
    const revenueData = periods.map(period => {
      const periodOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= period.start && orderDate <= period.end;
      });
      
      return periodOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    });

    const orderData = periods.map(period => {
      return orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= period.start && orderDate <= period.end;
      }).length;
    });

    return {
      labels: periods.map(p => p.label),
      revenue: revenueData,
      orders: orderData
    };
  };

  // Chart configurations
  const revenueChartData = {
    labels: stats.chartData.labels,
    datasets: [
      {
        label: 'Revenue (₹)',
        data: stats.chartData.revenue,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const ordersChartData = {
    labels: stats.chartData.labels,
    datasets: [
      {
        label: 'Orders',
        data: stats.chartData.orders,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e5e7eb',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: chartType === 'revenue' ? `Revenue Trends (${timeRange})` : `Order Trends (${timeRange})`,
        color: '#f3f4f6',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: '#9ca3af',
          callback: function(value) {
            return chartType === 'revenue' ? `₹${value.toLocaleString()}` : value;
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: '#9ca3af',
        }
      }
    },
  };

  // Status distribution chart
  const statusData = {
    labels: ['Pending', 'Ordered', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [
      {
        data: [
          stats.recentOrders.filter(o => o.status === 'pending').length,
          stats.recentOrders.filter(o => o.status === 'ordered').length,
          stats.recentOrders.filter(o => o.status === 'shipped').length,
          stats.recentOrders.filter(o => o.status === 'delivered').length,
          stats.recentOrders.filter(o => o.status === 'cancelled').length,
        ],
        backgroundColor: [
          '#fbbf24',
          '#3b82f6',
          '#8b5cf6',
          '#10b981',
          '#ef4444',
        ],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e5e7eb',
          padding: 20,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: 'Order Status Distribution',
        color: '#f3f4f6',
        font: {
          size: 14,
          weight: 'bold'
        }
      },
    },
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="p-4 bg-red-600 text-white rounded-lg text-center">
        {error}
      </div>
    );
  }

  return (
    <div className='bg-black min-h-screen'>
      <div className="bg-black text-white">
        <div className="px-4 py-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-transparent">
                Welcome back, {user?.name}
              </h1>
              <p className="text-gray-400 mt-2">Here's what's happening with your store today.</p>
            </div>
            <Link
              to="/seller/products/new"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-gray-900 rounded-lg font-bold hover:from-[#A6FFCB] hover:to-[#1FA2FF] transition-all duration-300 transform hover:scale-105"
            >
              <FaPlus /> Add New Product
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                label: 'Total Products', 
                value: stats.totalProducts, 
                icon: <FaBox className="text-2xl" />, 
                color: 'from-blue-500 to-blue-600',
                bgColor: 'bg-blue-500/10',
                borderColor: 'border-blue-500/20'
              },
              { 
                label: 'Total Orders', 
                value: stats.totalOrders, 
                icon: <FaShoppingBag className="text-2xl" />, 
                color: 'from-purple-500 to-purple-600',
                bgColor: 'bg-purple-500/10',
                borderColor: 'border-purple-500/20'
              },
              { 
                label: 'Paid Revenue', 
                value: `₹${stats.paidRevenue.toFixed(2)}`, 
                icon: <FaDollarSign className="text-2xl" />, 
                color: 'from-green-500 to-green-600',
                bgColor: 'bg-green-500/10',
                borderColor: 'border-green-500/20'
              },
              { 
                label: 'Total Revenue', 
                value: `₹${stats.totalRevenue.toFixed(2)}`, 
                icon: <FaChartLine className="text-2xl" />, 
                color: 'from-yellow-500 to-yellow-600',
                bgColor: 'bg-yellow-500/10',
                borderColor: 'border-yellow-500/20'
              },
            ].map((item, idx) => (
              <div key={idx} className={`p-6 rounded-xl shadow-lg border ${item.bgColor} ${item.borderColor} backdrop-blur-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 font-medium">{item.label}</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{item.value}</h3>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${item.color}`}>
                    {item.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Main Chart */}
            <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-white">Analytics Overview</h2>
                <div className="flex flex-wrap gap-2">
                  {/* Chart Type Toggle */}
                  <div className="flex bg-gray-800 rounded-lg p-1">
                    <button
                      onClick={() => setChartType('revenue')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        chartType === 'revenue'
                          ? 'bg-green-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Revenue
                    </button>
                    <button
                      onClick={() => setChartType('orders')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        chartType === 'orders'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Orders
                    </button>
                  </div>
                  
                  {/* Time Range Toggle */}
                  <div className="flex bg-gray-800 rounded-lg p-1">
                    {['week', 'month', 'year'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors capitalize ${
                          timeRange === range
                            ? 'bg-cyan-600 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="h-80">
                {chartType === 'revenue' ? (
                  <Line data={revenueChartData} options={chartOptions} />
                ) : (
                  <Bar data={ordersChartData} options={chartOptions} />
                )}
              </div>
            </div>

            {/* Status Distribution */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50">
              <div className="h-80">
                <Doughnut data={statusData} options={doughnutOptions} />
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Recent Orders</h2>
              <Link 
                to="/seller/orders"
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                View All Orders →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead>
                  <tr className="border-b border-gray-700 text-gray-400">
                    <th className="py-3 px-4 font-semibold">Order ID</th>
                    <th className="py-3 px-4 font-semibold">Customer</th>
                    <th className="py-3 px-4 font-semibold">Products</th>
                    <th className="py-3 px-4 font-semibold">Total</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 px-4 font-mono text-sm">{order._id.slice(-8)}</td>
                        <td className="py-3 px-4">{order.customer}</td>
                        <td className="py-3 px-4">{order.products}</td>
                        <td className="py-3 px-4 font-semibold">₹{order.total.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-600/20 text-green-400' :
                            order.status === 'shipped' ? 'bg-purple-600/20 text-purple-400' :
                            order.status === 'ordered' ? 'bg-blue-600/20 text-blue-400' :
                            order.status === 'cancelled' ? 'bg-red-600/20 text-red-400' :
                            'bg-yellow-600/20 text-yellow-400'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.isPaid ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                          }`}>
                            {order.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-gray-400">
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