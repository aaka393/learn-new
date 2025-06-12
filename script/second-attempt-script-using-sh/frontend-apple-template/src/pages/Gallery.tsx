import React, { useState, useEffect } from 'react';
import { fetchGalleryImages } from '../services/apiService';
import { motion } from 'framer-motion';
import { baseUrl } from '../constants/appConstants';

interface GalleryImage {
  id: number;
  name: string;
  url: string;
  formats: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
  };
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        const data = await fetchGalleryImages();
        setImages(data);
      } catch (err) {
        console.error('Failed to load gallery images:', err);
        setError('Failed to load gallery. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadGalleryImages();
  }, []);

  // Fallback images in case API fails
  const fallbackImages = [
    {
      id: 1,
      name: "Web Development",
      url: "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg",
      formats: {}
    },
    {
      id: 2,
      name: "Robotics",
      url: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg",
      formats: {}
    },
    {
      id: 3,
      name: "Digital Innovation",
      url: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
      formats: {}
    },
    {
      id: 4,
      name: "Team Collaboration",
      url: "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg",
      formats: {}
    },
    {
      id: 5,
      name: "Technology",
      url: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg",
      formats: {}
    },
    {
      id: 6,
      name: "Innovation Hub",
      url: "https://images.pexe`ls.com/photos/3861967/pexels-photo-3861967.jpeg",
      formats: {}
    }
  ];

  const getImageUrl = (image: GalleryImage): string => {
    if (image.formats?.medium?.url) {
      return `${baseUrl}${image.formats.medium.url}`;
    } else if (image.formats?.small?.url) {
      return `${baseUrl}${image.formats.small.url}`;
    } else if (image.url.startsWith('http')) {
      return image.url;
    } else {
      return `${baseUrl}${image.url}`;
    }
  };

  const displayImages = images.length > 0 ? images : fallbackImages;

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && images.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-24">
      {/* Header */}
      <div className="bg-gray-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Gallery
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Explore our collection of images showcasing our work and team
          </motion.p>
        </div>
      </div>
      
      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayImages.map((image, index) => (
            <motion.div 
              key={image.id}
              className="cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onClick={() => openLightbox(image)}
            >
              <div className="relative pb-[66.67%]"> {/* 3:2 aspect ratio */}
                <img 
                  src={image.url.startsWith('http') ? image.url : getImageUrl(image)} 
                  alt={image.name} 
                  className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-medium text-gray-900">{image.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Lightbox */}
      {selectedImage && (
        <motion.div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLightbox}
        >
          <div 
            className="max-w-5xl max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage.url.startsWith('http') ? selectedImage.url : getImageUrl(selectedImage)} 
              alt={selectedImage.name} 
              className="max-w-full max-h-[80vh] object-contain mx-auto"
            />
            <div className="absolute top-4 right-4">
              <button 
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 text-white"
                onClick={closeLightbox}
              >
                ✕
              </button>
            </div>
            <div className="text-white text-center mt-4">
              <h3 className="text-xl">{selectedImage.name}</h3>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Gallery;