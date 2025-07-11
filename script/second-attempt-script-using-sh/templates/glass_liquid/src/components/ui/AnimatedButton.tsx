import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 overflow-hidden group';
  
  const variantClasses = {
    primary: 'btn-primary-glass',
    secondary: 'btn-glass',
    ghost: 'text-gray-600 hover:text-gray-800 hover:glass-subtle',
  };

  const sizeClasses = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-12 py-6 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const buttonContent = (
    <>
      <motion.span
        className="relative z-10"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
      >
        {children}
      </motion.span>
      
      {/* Glass shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100"
        initial={{ x: '-100%', skewX: -15 }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
      
      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-white/10 blur-xl opacity-0 group-hover:opacity-100 -z-10"
        transition={{ duration: 0.3 }}
      />
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ 
          scale: 1.02,
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {buttonContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={classes}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {buttonContent}
    </motion.button>
  );
};

export default AnimatedButton;