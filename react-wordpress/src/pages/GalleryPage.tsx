import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchGalleryItems } from '../services/api';
import { WordPressGalleryItem } from '../types/wordpress';
import Loader from '../components/common/Loader';

const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<WordPressGalleryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<WordPressGalleryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGallery = async () => {
    setIsLoading(true);
    try {
      const result = await fetchGalleryItems();
      if (result) {
        setItems(result.items);
      } else {
        setError('No gallery items found.');
      }
    } catch (err) {
      console.error('Error loading gallery:', err);
      setError('Failed to load gallery items.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  



  if (isLoading) return <Loader message="Loading gallery..." />;

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button onClick={loadGallery} className="px-4 py-2 bg-blue-600 text-white rounded">Retry</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">Gallery</h1>
          <p className="text-gray-600">Explore and manage images</p>
          
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative group border rounded-xl overflow-hidden bg-white shadow"
            >
              <div className="aspect-w-3 aspect-h-2">
                <img
                  src={item.source_url}
                  alt={item.title.rendered}
                  className="object-cover w-full h-64 group-hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{item.title.rendered}</h3>
                {item.meta?.gallery_category && <p className="text-sm text-gray-500">{item.meta.gallery_category}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setSelectedItem(null)}>
          <div className="bg-white rounded-lg overflow-hidden relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={selectedItem.source_url} alt={selectedItem.title.rendered} className="w-full" />
            <div className="p-4">
              <h3 className="text-xl font-bold">{selectedItem.title.rendered}</h3>
              <div dangerouslySetInnerHTML={{ __html: selectedItem.content?.rendered || '' }} className="prose" />
            </div>
            <button className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-2 rounded-full" onClick={() => setSelectedItem(null)}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
