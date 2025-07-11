import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Grid, List } from 'lucide-react';
import { fetchGalleryImages } from '../services/apiService';
import { baseUrl } from '../constants/appConstants';
import { useUIStore } from '../store/useUIStore';
import MotionDiv from '../components/ui/MotionDiv';
import HoverImage from '../components/ui/HoverImage';

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
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const { selectedImage, setSelectedImage } = useUIStore();

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
      url: "https://images.pexels.com/photos/3861967/pexels-photo-3861967.jpeg",
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
      <div className="flex justify-center items-center min-h-screen animated-bg">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (error && images.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animated-bg min-h-screen">
        <div className="glass-card p-8 rounded-3xl border border-red-500/20">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-24 animated-bg min-h-screen">
      {/* Header */}
      <div className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <MotionDiv delay={0.1}>
            <h1 className="text-6xl md:text-7xl font-black mb-6 gradient-text">
              Gallery
            </h1>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Explore our collection of images showcasing our work and team
            </p>
          </MotionDiv>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <MotionDiv delay={0.3}>
          <div className="flex justify-center">
            <div className="glass rounded-2xl p-2 flex">
              <motion.button
                className={`flex items-center px-4 py-2 rounded-xl transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
                onClick={() => setViewMode('grid')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Grid size={18} className="mr-2" />
                Grid
              </motion.button>
              <motion.button
                className={`flex items-center px-4 py-2 rounded-xl transition-all duration-300 ${
                  viewMode === 'masonry' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
                onClick={() => setViewMode('masonry')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <List size={18} className="mr-2" />
                Masonry
              </motion.button>
            </div>
          </div>
        </MotionDiv>
      </div>
      
      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid gap-8 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }`}>
          {displayImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="group relative overflow-hidden glass-card rounded-3xl hover-lift card-hover"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`relative ${
                viewMode === 'masonry' && index % 3 === 1 ? 'pb-[100%]' : 'pb-[75%]'
              }`}>
                <HoverImage
                  src={image.url.startsWith('http') ? image.url : getImageUrl(image)}
                  alt={image.name}
                  className="absolute inset-0 w-full h-full"
                  onClick={() => openLightbox(image)}
                >
                  <motion.div
                    className="glass p-3 rounded-2xl"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ZoomIn size={24} className="text-white" />
                  </motion.div>
                </HoverImage>
              </div>
              
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-6"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-white font-semibold text-lg">{image.name}</h3>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="relative max-w-7xl max-h-[90vh] mx-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                className="absolute top-4 right-4 z-10 glass p-3 rounded-full text-white hover:bg-white/20 transition-colors"
                onClick={closeLightbox}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>

              <img
                src={selectedImage.url.startsWith('http') ? selectedImage.url : getImageUrl(selectedImage)}
                alt={selectedImage.name}
                className="max-w-full max-h-[80vh] object-contain mx-auto rounded-2xl"
              />

              <motion.div
                className="absolute bottom-4 left-0 right-0 text-center text-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="glass px-6 py-3 rounded-2xl inline-block">
                  <h3 className="text-2xl font-semibold">{selectedImage.name}</h3>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;