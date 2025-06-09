import { useState, useEffect } from 'react';
import {
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaTimes,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Alert = ({
  type = 'info',
  message,
  onClose,
  autoClose = true,
  autoCloseTime = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timer;
    if (autoClose && isVisible) {
      timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoCloseTime);
    }

    return () => clearTimeout(timer);
  }, [autoClose, autoCloseTime, isVisible, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  let icon, bgColor, textColor, borderColor;

  switch (type) {
    case 'success':
      icon = <FaCheckCircle className="text-2xl" />;
      bgColor = 'bg-green-900';
      textColor = 'text-green-300';
      borderColor = 'border-green-600';
      break;
    case 'warning':
      icon = <FaExclamationTriangle className="text-2xl" />;
      bgColor = 'bg-yellow-900';
      textColor = 'text-yellow-300';
      borderColor = 'border-yellow-600';
      break;
    case 'error':
      icon = <FaTimesCircle className="text-2xl" />;
      bgColor = 'bg-red-900';
      textColor = 'text-red-300';
      borderColor = 'border-red-600';
      break;
    case 'info':
    default:
      icon = <FaInfoCircle className="text-2xl" />;
      bgColor = 'bg-gray-800';
      textColor = 'text-[#12D8FA]';
      borderColor = 'border-[#1FA2FF]';
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{
            opacity: 0,
            x:20,
            scale: 0.95,
            transition: { duration: 0.2 },
          }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
          className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
          <div className={`rounded-lg p-4 ${bgColor} border-l-4 ${borderColor} shadow-lg`}>
            <div className="flex items-start">
              <div className={`flex-shrink-0 mr-3 ${textColor}`}>{icon}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-base font-medium ${textColor} break-words`}>{message}</p>
              </div>
              <div className="ml-auto pl-4">
                <button
                  onClick={handleClose}
                  className={`inline-flex items-center justify-center rounded-full p-2 ${textColor} hover:bg-gray-700 focus:outline-none transition-colors duration-200`}
                >
                  <span className="sr-only">Dismiss</span>
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
