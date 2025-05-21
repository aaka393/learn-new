import React from 'react';
import { Link } from 'react-router-dom';



const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold text-gray-800 dark:text-white">
          Blog Title
        </a>
        <div className="flex items-center space-x-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
            </li>
            <li>
              <Link to="/articles" className="text-blue-600 hover:text-blue-800">Articles</Link>
            </li>
            <li>
              <Link to="/about" className="text-blue-600 hover:text-blue-800">About</Link>
            </li>
            <li>
              <Link to="/author" className="text-blue-600 hover:text-blue-800">Author</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
