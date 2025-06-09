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
  const [showUserMenu, setShowUserMenu] = useState(false); // State for desktop user dropdown
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
    // Close mobile menu and user menu on route change
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false); // Close mobile menu after search
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
    setIsOpen(false); // Close mobile menu after category click
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false); // Close user menu on logout
  };

  return (
    <header
      className={`${
        isScrolled
          ? 'bg-richblack-800 shadow-lg border-b border-gray-800'
          : 'bg-richblack-800'
      } fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-semibold bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-transparent font-serif tracking-wide mr-3"
          >
            <div className='ml-[-0%]'>
            FASHIONISTA
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-5">
            <Link to="/" className="text-gray-300 hover:text-[#12D8FA] transition-colors font-medium text-lg relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#12D8FA] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <button onClick={() => handleCategoryClick('men')} className="text-gray-300 hover:text-[#12D8FA] transition-colors font-medium text-lg relative group">
              Men
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#12D8FA] group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => handleCategoryClick('women')} className="text-gray-300 hover:text-[#12D8FA] transition-colors font-medium text-lg relative group">
              Women
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#12D8FA] group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => handleCategoryClick('kids')} className="text-gray-300 hover:text-[#12D8FA] transition-colors font-medium text-lg relative group">
              Kids
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#12D8FA] group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => handleCategoryClick('accessories')} className="text-gray-300 hover:text-[#12D8FA] transition-colors font-medium text-lg relative group">
              Accessories
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#12D8FA] group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center max-w-sm flex-1 mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-[#12D8FA] focus:ring-2 focus:ring-[#1FA2FF] transition-colors duration-200 text-base"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            </div>
          </form>

          {/* Desktop User Menu & Cart */}
          <div className="hidden lg:flex items-center space-x-7">
            <Link to="/cart" className="relative text-gray-300 hover:text-[#A6FFCB] transition-colors group">
              <FaShoppingCart className="text-2xl group-hover:scale-110 transition-transform" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#A6FFCB] text-gray-900 text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-[#A6FFCB] transition-colors font-medium"
                >
                  <span className="text-lg">{user?.name?.split(' ')[0]}</span>
                  <FaChevronDown className={`text-gray-400 text-base transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-gray-900 rounded-lg shadow-xl py-2 border border-gray-700">
                    <Link to={user?.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'} className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-[#12D8FA] transition-colors">
                      Dashboard
                    </Link>
                    {user?.role === 'buyer' ? (
                      <>
                        <Link to="/buyer/orders" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-[#12D8FA] transition-colors">My Orders</Link>
                        <Link to="/buyer/wishlist" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-[#12D8FA] transition-colors">
                          <FaHeart className="inline mr-3 text-lg" />
                          Wishlist
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/seller/orders" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-[#12D8FA] transition-colors">Orders</Link>
                        <Link to="/seller/products" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-[#12D8FA] transition-colors">
                          <FaStore className="inline mr-3 text-lg" />
                          My Products
                        </Link>
                      </>
                    )}
                    <div className="border-t border-gray-700 my-1"></div>
                    <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-red-500 transition-colors">
                      <FaSignOutAlt className="inline mr-3 text-lg" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full text-gray-300 border border-gray-700 hover:bg-gray-800 hover:text-[#12D8FA] transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-gray-900 px-5 py-2 rounded-full font-bold hover:from-[#A6FFCB] hover:to-[#1FA2FF] transition-all duration-300 transform hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="lg:hidden flex items-center gap-5">
            <Link to="/cart" className="relative text-gray-300 hover:text-[#A6FFCB] transition-colors">
              <FaShoppingCart className="text-2xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#A6FFCB] text-gray-900 text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-[#12D8FA] transition-colors focus:outline-none"
            >
              {isOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Mobile Menu Content */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-64 bg-gray-950 border-l border-gray-800 shadow-2xl p-6 transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-300 hover:text-red-500 transition-colors focus:outline-none"
          >
            <FaTimes size={26} />
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-[#12D8FA] focus:ring-2 focus:ring-[#1FA2FF] transition-colors text-base"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          </div>
        </form>

        {/* Mobile Navigation Links */}
        <div className="flex flex-col space-y-4 border-b border-gray-800 pb-6 mb-6">
          <Link to="/" className="mobile-nav-link text-gray-300 hover:text-[#12D8FA] transition-colors text-lg font-medium">Home</Link>
          <button onClick={() => handleCategoryClick('men')} className="mobile-nav-link text-left text-gray-300 hover:text-[#12D8FA] transition-colors text-lg font-medium">Men</button>
          <button onClick={() => handleCategoryClick('women')} className="mobile-nav-link text-left text-gray-300 hover:text-[#12D8FA] transition-colors text-lg font-medium">Women</button>
          <button onClick={() => handleCategoryClick('kids')} className="mobile-nav-link text-left text-gray-300 hover:text-[#12D8FA] transition-colors text-lg font-medium">Kids</button>
          <button onClick={() => handleCategoryClick('accessories')} className="mobile-nav-link text-left text-gray-300 hover:text-[#12D8FA] transition-colors text-lg font-medium">Accessories</button>
        </div>

        {/* Mobile User Actions */}
        <div>
          {isAuthenticated ? (
            <div className="flex flex-col space-y-4">
              <Link to={user?.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'} className="mobile-nav-link text-gray-300 hover:text-[#12D8FA] transition-colors text-lg font-medium">
                Dashboard
              </Link>
              {user?.role === 'buyer' ? (
                <>
                  <Link to="/buyer/orders" className="mobile-nav-link text-gray-300 hover:text-[#12D8FA] transition-colors text-lg font-medium">My Orders</Link>
                  <Link to="/buyer/wishlist" className="mobile-nav-link text-gray-300 hover:text-[#12D8FA] transition-colors text-lg font-medium">
                    <FaHeart className="inline mr-3" />
                    Wishlist
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/seller/orders" className="mobile-nav-link text-gray-300 hover:text-[#12D8FA] transition-colors text-lg font-medium">Orders</Link>
                  <Link to="/seller/products" className="mobile-nav-link text-gray-300 hover:text-[#12D8FA] transition-colors text-lg font-medium">
                    <FaStore className="inline mr-3" />
                    My Products
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="mobile-nav-link text-left text-gray-300 hover:text-red-500 transition-colors text-lg font-medium">
                <FaSignOutAlt className="inline mr-3" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Link
                to="/login"
                className="px-5 py-3 rounded-full text-gray-300 border border-gray-700 hover:bg-gray-800 hover:text-[#12D8FA] transition-colors font-medium text-center"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-gray-900 px-5 py-3 rounded-full font-bold hover:from-[#A6FFCB] hover:to-[#1FA2FF] transition-all duration-300 text-center"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;