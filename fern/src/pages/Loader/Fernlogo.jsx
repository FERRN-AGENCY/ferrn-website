import { motion } from 'framer-motion';

export const FernLogo = ({ className, variants }) => {
  return (
    <motion.svg 
      className={className} 
      /* FIX: This exact viewBox is what allows the icon to get BIG */
      viewBox="0 0 32 34" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path 
        d="M32 0V34H0V22.6912H20.9931V11.0065H3.32941V0H32Z" 
        variants={variants}
      />
    </motion.svg>
  );
};