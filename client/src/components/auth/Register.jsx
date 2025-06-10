import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext.jsx';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaStore, FaShoppingBag } from 'react-icons/fa';
import Alert from '../common/Alert.jsx';
import Loader from '../common/Loader.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'buyer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/buyer/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const { name, email, password, password2, role } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, role);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-gray-950 to-black text-white">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-extrabold bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-transparent mb-2 tracking-wide">
            Create Account
          </h1>
          <p className="text-gray-400">Join our community today</p>
        </div>

        {error && <Alert type="error" message={error} />}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-group">
            <label htmlFor="name" className="flex items-center gap-2 mb-2 text-gray-300 font-medium">
              <FaUser className="text-[#12D8FA]" />
              <span>Full Name<sup className="text-red-400">*</sup></span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full rounded-lg border border-gray-700 bg-[#1f1f1f] text-white px-4 py-2 focus:ring-2 focus:ring-[#12D8FA] focus:outline-none shadow-inner"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="flex items-center gap-2 mb-2 text-gray-300 font-medium">
              <FaEnvelope className="text-[#12D8FA]" />
              <span>Email Address<sup className="text-red-400">*</sup></span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={handleChange}
              placeholder="Your email address"
              className="w-full rounded-lg border border-gray-700 bg-[#1f1f1f] text-white px-4 py-2 focus:ring-2 focus:ring-[#12D8FA] focus:outline-none shadow-inner"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="flex items-center gap-2 mb-2 text-gray-300 font-medium">
              <FaLock className="text-[#12D8FA]" />
              <span>Password<sup className="text-red-400">*</sup></span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                autoComplete="new-password"
                value={password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full pr-12 rounded-lg border border-gray-700 bg-[#1f1f1f] text-white px-4 py-2 focus:ring-2 focus:ring-[#12D8FA] focus:outline-none shadow-inner"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                onClick={toggleShowPassword}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Must be at least 6 characters</p>
          </div>

          <div className="form-group">
            <label htmlFor="password2" className="flex items-center gap-2 mb-2 text-gray-300 font-medium">
              <FaLock className="text-[#12D8FA]" />
              <span>Confirm Password<sup className="text-red-400">*</sup></span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password2"
              name="password2"
              autoComplete="new-password"
              value={password2}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full rounded-lg border border-gray-700 bg-[#1f1f1f] text-white px-4 py-2 focus:ring-2 focus:ring-[#12D8FA] focus:outline-none shadow-inner"
              required
            />
          </div>

          <div className="form-group">
            <label className="block mb-3 text-gray-300 font-medium">Account Type<sup className="text-red-400">*</sup></label>
            <div className="grid grid-cols-2 gap-4">
              <label
                className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                  role === 'buyer'
                    ? 'border-[#12D8FA] bg-[#12D8FA]/10 text-white'
                    : 'border-gray-700 text-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  autoComplete='off'
                  value="buyer"
                  checked={role === 'buyer'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <FaShoppingBag />
                <span>Buyer</span>
              </label>
              <label
                className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                  role === 'seller'
                    ? 'border-[#12D8FA] bg-[#12D8FA]/10 text-white'
                    : 'border-gray-700 text-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  autoComplete='off'
                  value="seller"
                  checked={role === 'seller'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <FaStore />
                <span>Seller</span>
              </label>
            </div>
          </div>

          <div className="flex items-center text-gray-400 text-sm">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              autoComplete='off'
              required
              className="mr-2 rounded-md border-gray-700 bg-[#1f1f1f] focus:ring-[#12D8FA]"
            />
            <label htmlFor="terms">
              I agree to the{' '}
              <a href="#" className="text-[#12D8FA] hover:text-[#1FA2FF]">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-[#12D8FA] hover:text-[#1FA2FF]">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-black font-bold hover:scale-105 transition-transform shadow-lg"
            disabled={loading}
          >
            {loading ? <Loader size="sm" /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[#12D8FA] hover:text-[#1FA2FF] font-semibold transition">
            Sign In
          </Link>
        </div>

        <div className="mt-8">
          <div className="relative flex items-center justify-center">
            <hr className="w-full border-t border-gray-700" />
            <span className="absolute bg-black px-3 text-sm text-gray-500">Or sign up with</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-700 rounded-lg bg-[#1f1f1f] text-white hover:bg-gray-800 transition-colors shadow"
            >
              <img src="https://cdn.simpleicons.org/google/ffffff/24" alt="Google" className="w-5 h-5" />
              <span>Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-700 rounded-lg bg-[#1f1f1f] text-white hover:bg-gray-800 transition-colors shadow"
            >
              <img src="https://cdn.simpleicons.org/facebook/ffffff/24" alt="Facebook" className="w-5 h-5" />
              <span>Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;