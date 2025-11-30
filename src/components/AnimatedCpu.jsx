import { motion } from "motion/react";

const transition = {
  duration: 0.5,
  ease: "easeInOut",
};

const AnimatedCpu = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "#ffffff",
  ...props
}) => {
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
      {...props}
    >
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <motion.path
        d="M15 2v2"
        initial={{ scaleY: 1, opacity: 1 }}
        whileHover={{ scaleY: [1, 1.5, 1], opacity: [1, 0.8, 1] }}
        transition={transition}
      />
      <motion.path
        d="M15 20v2"
        initial={{ scaleY: 1, opacity: 1 }}
        whileHover={{ scaleY: [1, 1.5, 1], opacity: [1, 0.8, 1] }}
        transition={transition}
      />
      <motion.path
        d="M2 15h2"
        initial={{ scaleX: 1, opacity: 1 }}
        whileHover={{ scaleX: [1, 1.5, 1], opacity: [1, 0.8, 1] }}
        transition={transition}
      />
      <motion.path
        d="M2 9h2"
        initial={{ scaleX: 1, opacity: 1 }}
        whileHover={{ scaleX: [1, 1.5, 1], opacity: [1, 0.8, 1] }}
        transition={transition}
      />
      <motion.path
        d="M20 15h2"
        initial={{ scaleX: 1, opacity: 1 }}
        whileHover={{ scaleX: [1, 1.5, 1], opacity: [1, 0.8, 1] }}
        transition={transition}
      />
      <motion.path
        d="M20 9h2"
        initial={{ scaleX: 1, opacity: 1 }}
        whileHover={{ scaleX: [1, 1.5, 1], opacity: [1, 0.8, 1] }}
        transition={transition}
      />
      <motion.path
        d="M9 2v2"
        initial={{ scaleY: 1, opacity: 1 }}
        whileHover={{ scaleY: [1, 1.5, 1], opacity: [1, 0.8, 1] }}
        transition={transition}
      />
      <motion.path
        d="M9 20v2"
        initial={{ scaleY: 1, opacity: 1 }}
        whileHover={{ scaleY: [1, 1.5, 1], opacity: [1, 0.8, 1] }}
        transition={transition}
      />
    </svg>
  );
};

export default AnimatedCpu;
