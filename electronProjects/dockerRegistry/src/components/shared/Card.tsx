import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  onClick,
  hoverable = false
}) => {
  const hoverClasses = hoverable 
    ? 'hover:bg-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-103'
    : '';

  return (
    <div 
      className={`bg-gray-800 rounded-lg shadow-md p-4 ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;