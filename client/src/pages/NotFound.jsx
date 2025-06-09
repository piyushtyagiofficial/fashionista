import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-extrabold bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-transparent font-poppins">
            404
          </h1>
          <h2 className="text-4xl font-bold text-white mt-4 mb-6 font-poppins">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
            The page you're looking for seems to have gone on a fashion getaway.
            It might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/"
              className="bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-gray-900 px-8 py-3 rounded-full font-bold hover:from-[#A6FFCB] hover:to-[#1FA2FF] transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Go to Home
            </Link>
            <Link
              to="/products"
              className="px-8 py-3 rounded-full text-gray-300 border border-gray-700 hover:bg-gray-800 hover:text-[#12D8FA] transition-colors font-medium shadow-lg"
            >
              Browse Products
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16"
        >
          <img
            src="https://images.pexels.com/photos/5625007/pexels-photo-5625007.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Lost in Fashion"
            className="w-full max-w-lg mx-auto rounded-xl shadow-2xl border-2 border-gray-700"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;