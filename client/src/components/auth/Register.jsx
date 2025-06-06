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
      // Redirect is handled in the useEffect
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-32 bg-gray-50">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-dark mb-2">Create Account</h1>
          <p className="text-neutral-600">Join Fashionista today</p>
        </div>

        {error && <Alert type="error" message={error} />}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-group">
            <label htmlFor="name" className="flex items-center gap-2 mb-2">
              <FaUser className="text-primary-main" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="flex items-center gap-2 mb-2">
              <FaEnvelope className="text-primary-main" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Your email address"
              className="w-full"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="flex items-center gap-2 mb-2">
              <FaLock className="text-primary-main" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
                onClick={toggleShowPassword}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-1">Must be at least 6 characters</p>
          </div>

          <div className="form-group">
            <label htmlFor="password2" className="flex items-center gap-2 mb-2">
              <FaLock className="text-primary-main" />
              <span>Confirm Password</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password2"
              name="password2"
              value={password2}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full"
              required
            />
          </div>

          <div className="form-group">
            <label className="block mb-3">Account Type</label>
            <div className="grid grid-cols-2 gap-4">              <label                className={`flex items-center justify-center gap-2 p-3 border rounded-md cursor-pointer transition-all ${
                  role === 'buyer'
                    ? 'border-[#1A237E] bg-[#1A237E] text-white'
                    : 'border-neutral-300 text-neutral-600 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  checked={role === 'buyer'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <FaShoppingBag />
                <span>Buyer</span>
              </label>
              <label
                className={`flex items-center justify-center gap-2 p-3 border rounded-md cursor-pointer transition-all ${
                  role === 'seller'
                    ? 'border-[#1A237E] bg-[#1A237E] text-white'
                    : 'border-neutral-300 text-neutral-600 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="role"
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

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              required
              className="mr-2"
            />
            <label htmlFor="terms" className="text-sm text-neutral-700">
              I agree to the{' '}
              <a href="#" className="text-primary-main hover:text-primary-dark">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-main hover:text-primary-dark">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? <Loader size="sm" /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-neutral-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-main hover:text-primary-dark font-semibold">
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-8">
          <div className="relative flex items-center justify-center">
            <hr className="w-full border-t border-neutral-300" />
            <span className="absolute bg-white px-4 text-sm text-neutral-500">Or sign up with</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2 px-4 border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
            >
              <img src="https://cdn.simpleicons.org/google/4285F4/24" alt="Google" className="w-5 h-5" />
              <span>Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2 px-4 border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
            >
              <img src="https://cdn.simpleicons.org/facebook/1877F2/24" alt="Facebook" className="w-5 h-5" />
              <span>Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;