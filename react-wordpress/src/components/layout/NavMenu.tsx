import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { fetchPages, fetchCategories } from '../../services/api';
import { WordPressPage, WordPressCategory } from '../../types/wordpress';

const NavMenu: React.FC = () => {
  const [pages, setPages] = useState<WordPressPage[]>([]);
  const [categories, setCategories] = useState<WordPressCategory[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isPageDropdownOpen, setIsPageDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const [pagesData, categoriesData] = await Promise.all([
          fetchPages(),
          fetchCategories()
        ]);

        // Filter and sort pages (exclude internal pages if needed)
        const menuPages = pagesData

        setPages(menuPages);

        // Filter categories with posts
        const menuCategories = categoriesData.filter(category => category.count > 0);
        setCategories(menuCategories);
      } catch (error) {
        console.error('Error loading menu data:', error);
      }
    };

    loadMenuItems();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-blue-600 font-bold text-xl">WP React</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/'
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
            >
              Home
            </Link>

            <Link
              to="/posts"
              className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/posts'
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
            >
              Blog
            </Link>

            <Link
              to="/events"
              className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/events'
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
            >
              Events
            </Link>

            <Link
              to="/gallery"
              className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/gallery'
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
            >
              Gallery
            </Link>

            {/* Dynamic pages from WordPress */}
            {pages.length > 0 && (
                          <div className="relative">
                            <button
                              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                              onClick={() => setIsPageDropdownOpen(!isPageDropdownOpen)} // Toggle page dropdown
                            >
                              Pages
                              <ChevronDown className="ml-1 h-4 w-4" />
                            </button>
            
                            {isPageDropdownOpen && (
                              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                  {pages.map((page) => (
                                    <Link
                                      key={page.id}
                                      to={`/${page.slug}`}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      role="menuitem"
                                      onClick={() => setIsPageDropdownOpen(false)} // Close dropdown when a link is clicked
                                    >
                                      {page.title.rendered}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

            {/* Categories dropdown */}
            {categories.length > 0 && (
              <div className="relative">
                <button
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                >
                  Categories
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {isCategoryDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/category/${category.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setIsCategoryDropdownOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/'
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
            >
              Home
            </Link>

            <Link
              to="/posts"
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/posts'
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
            >
              Blog
            </Link>

            <Link
              to="/events"
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/events'
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
            >
              Events
            </Link>

            <Link
              to="/gallery"
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/gallery'
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
            >
              Gallery
            </Link>

            {/* Dynamic pages from WordPress */}
            {pages.map((page) => (
              <Link
                key={page.id}
                to={`/${page.slug}`}
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === `/${page.slug}`
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
              >
                {page.title.rendered}
              </Link>
            ))}

            {/* Categories in mobile */}
            {categories.length > 0 && (
              <>
                <div className="px-3 py-2 text-base font-medium text-gray-700">
                  Categories
                </div>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="block px-3 py-2 pl-6 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  >
                    {category.name}
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavMenu;