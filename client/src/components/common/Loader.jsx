import { motion } from 'framer-motion';

const Loader = ({ size = 'md', fullScreen = false }) => {
  let dimensions;
  
  switch (size) {
    case 'sm':
      dimensions = 'w-6 h-6 border-[3px]'; // Slightly larger for better visibility
      break;
    case 'lg':
      dimensions = 'w-14 h-14 border-[5px]'; // Adjusted for a more substantial loader
      break;
    case 'md':
    default:
      dimensions = 'w-10 h-10 border-4'; // Standard medium size
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

  // Define the colors from your theme for the border
  const borderColor = "border-[#1FA2FF]"; // Start color of your gradient
  const lightBorderColor = "border-[#A6FFCB]"; // End color of your gradient or a contrasting light color

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
        <motion.div
          // Apply gradient colors to the border for a dynamic look
          // Using different border sides for subtle color shifts during rotation
          className={`${dimensions} rounded-full border-t-[#12D8FA] border-r-[#A6FFCB] border-b-[#1FA2FF] border-l-gray-700`}
          animate="animate"
          variants={loaderVariants}
        >
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-4"> {/* Added padding for better standalone presentation */}
      <motion.div
        // Apply gradient colors to the border for a dynamic look
        className={`${dimensions} rounded-full border-t-[#12D8FA] border-r-[#A6FFCB] border-b-[#1FA2FF] border-l-gray-700`}
        animate="animate"
        variants={loaderVariants}
      >
      </motion.div>
    </div>
  );
};

export default Loader;