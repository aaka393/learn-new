import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 dark:bg-gray-700 py-4 mt-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          &copy; {new Date().getFullYear()} Blog Title. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
