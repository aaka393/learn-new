import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchGalleryItems } from '../services/api';
import { WordPressGalleryItem } from '../types/wordpress';
import Loader from '../components/common/Loader';
import Pagination from '../components/posts/Pagination';

const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<WordPressGalleryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<WordPressGalleryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadGalleryItems = async () => {
      setIsLoading(true);
      try {
        const result = await fetchGalleryItems(currentPage);
        if (result) {
          setItems(result.items);
          setTotalPages(result.pagination.totalPages);
        } else {
          setError('No gallery items found.');
        }
      } catch (err) {
        console.error('Error loading gallery:', err);
        setError('Failed to load gallery items. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    

    loadGalleryItems();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return <Loader message="Loading gallery..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gallery</h1>
          <p className="text-lg text-gray-600">Explore our collection of beautiful images</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative group cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={item._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                  alt={item.title.rendered}
                  className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300" />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.title.rendered}
                </h3>
                {item.meta?.gallery_category && (
                  <p className="text-sm text-gray-500">{item.meta.gallery_category}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            pagination={{
              currentPage,
              totalPages,
              totalItems: items.length
            }}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Modal for selected item */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={selectedItem._embedded?.['wp:featuredmedia']?.[0]?.source_url}
              alt={selectedItem.title.rendered}
              className="w-full h-auto"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedItem.title.rendered}
              </h3>
              <div
                className="prose prose-sm"
                dangerouslySetInnerHTML={{ __html: selectedItem.content.rendered }}
              />
            </div>
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
              onClick={() => setSelectedItem(null)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;