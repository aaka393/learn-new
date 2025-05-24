import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchHeaderData } from '../services/service';
import { HeaderData } from '../types/Header'

const Header: React.FC = () => {
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const location = useLocation();

  useEffect(() => {
    const loadHeader = async () => {
      const data = await fetchHeaderData();
      if (data) setHeaderData(data);
    };

    loadHeader();
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
          {headerData?.title || 'Loading...'}
        </Link>
        <nav>
          <ul className="flex gap-6 text-sm font-medium">
            {headerData?.menu_items.map((item) => (
              <li key={item.slug}>
                <Link
                  to={item.slug}
                  className={`${
                    location.pathname === item.slug
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  } transition-colors duration-200`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
