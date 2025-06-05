import { motion } from 'framer-motion';

const Loader = ({ size = 'md', fullScreen = false }) => {
  let dimensions;
  
  switch (size) {
    case 'sm':
      dimensions = 'w-5 h-5 border-2';
      break;
    case 'lg':
      dimensions = 'w-12 h-12 border-4';
      break;
    case 'md':
    default:
      dimensions = 'w-8 h-8 border-3';
  }

  const loaderVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <motion.div
          className={`${dimensions} rounded-full border-t-primary-main border-r-primary-light border-b-primary-light border-l-primary-light`}
          animate="animate"
          variants={loaderVariants}
        ></motion.div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <motion.div
        className={`${dimensions} rounded-full border-t-primary-main border-r-primary-light border-b-primary-light border-l-primary-light`}
        animate="animate"
        variants={loaderVariants}
      ></motion.div>
    </div>
  );
};

export default Loader;