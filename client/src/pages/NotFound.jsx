import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-primary-600 font-poppins">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mt-4 mb-6 font-poppins">Page Not Found</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/"
              className="btn btn-primary px-8 py-3"
            >
              Go to Home
            </Link>
            <Link
              to="/products"
              className="btn btn-outline px-8 py-3"
            >
              Browse Products
            </Link>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-12"
        >
          <img
            src="https://images.pexels.com/photos/5625007/pexels-photo-5625007.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Lost in Fashion"
            className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;