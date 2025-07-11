import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AnimatedLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'underline' | 'glow' | 'scale';
}

const AnimatedLink: React.FC<AnimatedLinkProps> = ({
  to,
  children,
  className = '',
  variant = 'underline',
}) => {
  const baseClasses = 'relative inline-block transition-colors duration-300';

  const variants = {
    underline: (
      <motion.span
        className="absolute bottom-0 left-0 h-0.5 bg-current origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ width: '100%' }}
      />
    ),
    glow: null,
    scale: null,
  };

  return (
    <Link to={to} className={`${baseClasses} ${className}`}>
      <motion.span
        whileHover={
          variant === 'glow'
            ? { textShadow: '0 0 8px currentColor' }
            : variant === 'scale'
            ? { scale: 1.05 }
            : {}
        }
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      {variant === 'underline' && variants.underline}
    </Link>
  );
};

export default AnimatedLink;