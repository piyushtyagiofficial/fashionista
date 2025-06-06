import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaSearch, FaBars, FaTimes, FaHeart, FaStore, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../../context/auth/AuthContext';
import { useCart } from '../../context/cart/CartContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
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
    setShowUserMenu(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <header 
      className={`${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md'
      } fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="text-xl lg:text-2xl font-bold text-primary-900 flex-shrink-0">
            FASHIONISTA
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link to="/" className="nav-link text-sm xl:text-base">Home</Link>
            <button onClick={() => handleCategoryClick('men')} className="nav-link text-sm xl:text-base">Men</button>
            <button onClick={() => handleCategoryClick('women')} className="nav-link text-sm xl:text-base">Women</button>
            <button onClick={() => handleCategoryClick('kids')} className="nav-link text-sm xl:text-base">Kids</button>
            <button onClick={() => handleCategoryClick('accessories')} className="nav-link text-sm xl:text-base">Accessories</button>
          </div>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center max-w-xs xl:max-w-sm flex-1 mx-4 xl:mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-full border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            </div>
          </form>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition-colors">
              <FaShoppingCart className="text-xl xl:text-2xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                >
                  <span className="text-sm xl:text-base font-medium">{user?.name?.split(' ')[0]}</span>
                  <FaChevronDown className={`text-xs transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
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
                    <hr className="my-2" />
                    <button onClick={handleLogout} className="menu-item w-full text-left text-red-600 hover:bg-red-50">
                      <FaSignOutAlt className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors text-sm xl:text-base">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary text-sm xl:text-base px-4 py-2">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button and Cart */}
          <div className="lg:hidden flex items-center gap-3">
            <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition-colors">
              <FaShoppingCart className="text-xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors p-2"
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-1 mb-6">
              <Link to="/" className="mobile-nav-link block py-3 px-4 rounded-md hover:bg-gray-50">Home</Link>
              <button onClick={() => handleCategoryClick('men')} className="mobile-nav-link block w-full text-left py-3 px-4 rounded-md hover:bg-gray-50">Men</button>
              <button onClick={() => handleCategoryClick('women')} className="mobile-nav-link block w-full text-left py-3 px-4 rounded-md hover:bg-gray-50">Women</button>
              <button onClick={() => handleCategoryClick('kids')} className="mobile-nav-link block w-full text-left py-3 px-4 rounded-md hover:bg-gray-50">Kids</button>
              <button onClick={() => handleCategoryClick('accessories')} className="mobile-nav-link block w-full text-left py-3 px-4 rounded-md hover:bg-gray-50">Accessories</button>
            </div>

            {/* Mobile User Menu */}
            <div className="pt-6 border-t border-gray-100">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <div className="px-4 py-2 text-sm text-gray-500 font-medium">
                    Welcome, {user?.name}
                  </div>
                  <Link to={user?.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'} className="mobile-nav-link block py-3 px-4 rounded-md hover:bg-gray-50">
                    Dashboard
                  </Link>
                  {user?.role === 'buyer' ? (
                    <>
                      <Link to="/buyer/orders" className="mobile-nav-link block py-3 px-4 rounded-md hover:bg-gray-50">My Orders</Link>
                      <Link to="/buyer/wishlist" className="mobile-nav-link block py-3 px-4 rounded-md hover:bg-gray-50">
                        <FaHeart className="inline mr-2" />
                        Wishlist
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/seller/orders" className="mobile-nav-link block py-3 px-4 rounded-md hover:bg-gray-50">Orders</Link>
                      <Link to="/seller/products" className="mobile-nav-link block py-3 px-4 rounded-md hover:bg-gray-50">
                        <FaStore className="inline mr-2" />
                        My Products
                      </Link>
                    </>
                  )}
                  <button onClick={handleLogout} className="mobile-nav-link block w-full text-left py-3 px-4 rounded-md hover:bg-red-50 text-red-600">
                    <FaSignOutAlt className="inline mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" className="btn btn-outline text-center py-3">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary text-center py-3">
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