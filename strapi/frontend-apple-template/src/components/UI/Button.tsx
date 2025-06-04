import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  href?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  href,
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300';
  
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-800 text-white hover:bg-gray-900',
    outline: 'border border-gray-300 text-gray-800 hover:bg-gray-100',
    text: 'text-blue-500 hover:text-blue-600 hover:underline',
  };
  
  const sizeStyles = {
    sm: 'text-sm px-4 py-1.5',
    md: 'text-base px-6 py-2',
    lg: 'text-lg px-8 py-3',
  };
  
  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={styles} onClick={onClick}>
        {children}
      </a>
    );
  }
  
  return (
    <button className={styles} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;