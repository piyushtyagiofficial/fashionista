import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext.jsx';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Alert from '../common/Alert.jsx';
import Loader from '../common/Loader.jsx';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
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

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-gray-950 to-black text-white">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-extrabold bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-transparent mb-2 tracking-wide">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm">Sign in to your account</p>
        </div>

        {error && <Alert type="error" message={error} />}

        <form onSubmit={handleSubmit} className="mt-6 flex w-full flex-col gap-y-5">
          <div className="form-group">
            <label htmlFor="email" className="flex items-center gap-2 mb-2 text-sm text-gray-300 font-medium">
              <FaEnvelope className="text-[#12D8FA]" />
              <span>Email Address<sup className="text-red-400">*</sup></span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Your email address"
              className="w-full rounded-lg border border-gray-700 bg-[#1f1f1f] text-white px-4 py-2 focus:ring-2 focus:ring-[#12D8FA] focus:outline-none shadow-inner"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="flex items-center gap-2 mb-2 text-sm text-gray-300 font-medium">
              <FaLock className="text-[#12D8FA]" />
              <span>Password<sup className="text-red-400">*</sup></span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Your password"
                className="w-full rounded-lg border border-gray-700 bg-[#1f1f1f] text-white px-4 py-2 pr-12 focus:ring-2 focus:ring-[#12D8FA] focus:outline-none shadow-inner"
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
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="mr-2 rounded text-[#12D8FA] focus:ring-[#12D8FA]"
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="text-[#12D8FA] hover:text-[#1FA2FF] transition">Forgot Password?</a>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-black font-bold hover:scale-105 transition-transform shadow-lg"
            disabled={loading}
          >
            {loading ? <Loader size="sm" /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#12D8FA] hover:text-[#1FA2FF] font-semibold transition">
            Register Now
          </Link>
        </div>

        <div className="mt-8">
          <div className="relative flex items-center justify-center">
            <hr className="w-full border-t border-gray-700" />
            <span className="absolute bg-black px-3 text-sm text-gray-500">Or continue with</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-700 rounded-lg bg-[#1f1f1f] text-white hover:bg-gray-800 transition-colors shadow"
            >
              <img src="https://cdn.simpleicons.org/google/ffffff/24" alt="Google" className="w-5 h-5" />
              <span className="text-white font-medium">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-700 rounded-lg bg-[#1f1f1f] text-white hover:bg-gray-800 transition-colors shadow"
            >
              <img src="https://cdn.simpleicons.org/facebook/ffffff/24" alt="Facebook" className="w-5 h-5" />
              <span className="text-white font-medium">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;