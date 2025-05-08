import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 py-12">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Page Not Found</h2>
      <p className="text-xl text-gray-600 mb-8 text-center max-w-md">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Link
          to="/"
          className="px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Go Home
        </Link>
        <Link
          to="/posts"
          className="px-5 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          View Blog
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;