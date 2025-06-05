import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaSearch, FaBars, FaTimes, FaHeart, FaStore } from 'react-icons/fa';
import { useAuth } from '../../context/auth/AuthContext';
import { useCart } from '../../context/cart/CartContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header 
      className={`${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-md'
      } fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-900">
            FASHIONISTA
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="nav-link">Home</Link>
            <button onClick={() => handleCategoryClick('men')} className="nav-link">Men</button>
            <button onClick={() => handleCategoryClick('women')} className="nav-link">Women</button>
            <button onClick={() => handleCategoryClick('kids')} className="nav-link">Kids</button>
            <button onClick={() => handleCategoryClick('accessories')} className="nav-link">Accessories</button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center max-w-xs flex-1 mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </form>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition-colors">
              <FaShoppingCart className="text-2xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                  <span>{user?.name?.split(' ')[0]}</span>
                  <FaUser />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <Link to={user?.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'} className="menu-item">
                    Dashboard
                  </Link>
                  {user?.role === 'buyer' ? (
                    <>
                      <Link to="/buyer/orders" className="menu-item">My Orders</Link>
                      <Link to="/buyer/wishlist" className="menu-item">
                        <FaHeart className="inline mr-2" />
                        Wishlist
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/seller/orders" className="menu-item">Orders</Link>
                      <Link to="/seller/products" className="menu-item">
                        <FaStore className="inline mr-2" />
                        My Products
                      </Link>
                    </>
                  )}
                  <button onClick={handleLogout} className="menu-item w-full text-left">
                    <FaSignOutAlt className="inline mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition-colors">
              <FaShoppingCart className="text-xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-4">
              <Link to="/" className="mobile-nav-link">Home</Link>
              <button onClick={() => handleCategoryClick('men')} className="mobile-nav-link text-left">Men</button>
              <button onClick={() => handleCategoryClick('women')} className="mobile-nav-link text-left">Women</button>
              <button onClick={() => handleCategoryClick('kids')} className="mobile-nav-link text-left">Kids</button>
              <button onClick={() => handleCategoryClick('accessories')} className="mobile-nav-link text-left">Accessories</button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-4">
                  <Link to={user?.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'} className="mobile-nav-link">
                    Dashboard
                  </Link>
                  {user?.role === 'buyer' ? (
                    <>
                      <Link to="/buyer/orders" className="mobile-nav-link">My Orders</Link>
                      <Link to="/buyer/wishlist" className="mobile-nav-link">
                        <FaHeart className="inline mr-2" />
                        Wishlist
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/seller/orders" className="mobile-nav-link">Orders</Link>
                      <Link to="/seller/products" className="mobile-nav-link">
                        <FaStore className="inline mr-2" />
                        My Products
                      </Link>
                    </>
                  )}
                  <button onClick={handleLogout} className="mobile-nav-link text-left">
                    <FaSignOutAlt className="inline mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/login" className="btn btn-outline text-center">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary text-center">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;