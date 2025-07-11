import React from 'react';
import { motion } from 'framer-motion';

interface HoverImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const HoverImage: React.FC<HoverImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  onClick,
  children 
}) => {
  return (
    <motion.div
      className={`relative overflow-hidden cursor-pointer group ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClick}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700"
        whileHover={{ scale: 1.1 }}
      />
      
      {/* Gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
      />
      
      {/* Glow border effect */}
      <motion.div
        className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-blue-500/50 to-purple-500/50 opacity-0 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3))',
          padding: '2px',
          borderRadius: 'inherit',
        }}
        transition={{ duration: 0.3 }}
      />
      
      {children && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="glass p-4 rounded-2xl">
            {children}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HoverImage;