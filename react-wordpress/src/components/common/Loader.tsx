import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'medium', message = 'Loading...' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'w-6 h-6';
      case 'large':
        return 'w-12 h-12';
      case 'medium':
      default:
        return 'w-8 h-8';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${getSizeClass()} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4`}></div>
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  );
};

export default Loader;