import { motion } from "motion/react";
import { useState } from "react";

const AnimatedFolders = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "#ffffff",
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: "block" }}
      {...props}
    >
      {/* Main folder */}
      <motion.path
        d="M20 17a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.9a2 2 0 0 1-1.69-.9l-.81-1.2a2 2 0 0 0-1.67-.9H8a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2Z"
        animate={{
          x: isHovered ? -4 : 0,
          y: isHovered ? 2 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      />
      {/* Bottom folder that fades away on hover */}
      <motion.path
        d="M2 8v11a2 2 0 0 0 2 2h14"
        animate={{
          opacity: isHovered ? 0 : 1,
          x: isHovered ? 4 : 0,
          y: isHovered ? -2 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      />
    </svg>
  );
};

export default AnimatedFolders;
