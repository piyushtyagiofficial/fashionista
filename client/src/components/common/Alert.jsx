import { useState, useEffect } from 'react';
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimesCircle, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Alert = ({ type = 'info', message, onClose, autoClose = true, autoCloseTime = 5000 }) => {
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

  // Define styles based on alert type
  let icon, bgColor, textColor, borderColor;

  switch (type) {
    case 'success':
      icon = <FaCheckCircle />;
      bgColor = 'bg-success-light';
      textColor = 'text-success-dark';
      borderColor = 'border-success-main';
      break;
    case 'warning':
      icon = <FaExclamationTriangle />;
      bgColor = 'bg-warning-light';
      textColor = 'text-warning-dark';
      borderColor = 'border-warning-main';
      break;
    case 'error':
      icon = <FaTimesCircle />;
      bgColor = 'bg-error-light';
      textColor = 'text-error-dark';
      borderColor = 'border-error-main';
      break;
    case 'info':
    default:
      icon = <FaInfoCircle />;
      bgColor = 'bg-primary-light/10';
      textColor = 'text-primary-dark';
      borderColor = 'border-primary-main';
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.3 }}
          className={`rounded-md p-4 ${bgColor} border-l-4 ${borderColor} mb-4`}
        >
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${textColor}`}>
              {icon}
            </div>
            <div className="ml-3 flex-1">
              <p className={`text-sm ${textColor}`}>{message}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={handleClose}
                  className={`inline-flex rounded-md p-1.5 ${textColor} hover:bg-white hover:bg-opacity-20 focus:outline-none`}
                >
                  <span className="sr-only">Dismiss</span>
                  <FaTimes className="h-4 w-4" />
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