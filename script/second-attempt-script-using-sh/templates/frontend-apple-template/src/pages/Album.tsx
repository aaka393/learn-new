import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ZoomIn, Grid, Image as ImageIcon } from 'lucide-react';
import { Album } from '../types/albums';
import { getAlbums } from '../services/apiService';
import { useGalleryStore } from '../store/galleryStore';
import { baseUrl } from '../constants/appConstants';
import MotionDiv from '../components/ui/MotionDiv';
import HoverImage from '../components/ui/HoverImage';
import AnimatedButton from '../components/ui/AnimatedButton';

const AlbumPage: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const { selectedImage, setSelectedImage } = useGalleryStore();

  useEffect(() => {
    const loadAlbums = async () => {
      try {
        const data = await getAlbums();
        setAlbums(data);
      } catch (error) {
        console.error('Failed to load albums:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAlbums();
  }, []);

  const getImageUrl = (url: string) => {
    return url.startsWith('http') ? url : `${baseUrl}${url}`;
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

  return (
    <div className="min-h-screen animated-bg pt-16 pb-24">
      {/* Header */}
      <div className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <MotionDiv delay={0.1}>
            <div className="flex items-center justify-center mb-6">
              {selectedAlbum ? <ImageIcon className="text-blue-400 mr-3" size={32} /> : <Grid className="text-blue-400 mr-3" size={32} />}
              <h1 className="text-6xl md:text-7xl font-black gradient-text">
                {selectedAlbum ? selectedAlbum.title : 'Albums'}
              </h1>
            </div>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {selectedAlbum 
                ? `${selectedAlbum.photos.length} ${selectedAlbum.photos.length === 1 ? 'photo' : 'photos'} in this collection`
                : 'Explore our curated collections of images and projects'
              }
            </p>
          </MotionDiv>
          
          {selectedAlbum && (
            <MotionDiv delay={0.3}>
              <div className="mt-8">
                <AnimatedButton
                  onClick={() => setSelectedAlbum(null)}
                  variant="secondary"
                  className="inline-flex items-center"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Back to Albums
                </AnimatedButton>
              </div>
            </MotionDiv>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!selectedAlbum ? (
          // Album Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {albums.map((album, index) => (
    <motion.div
      key={album.id}
      className="relative rounded-3xl overflow-hidden cursor-pointer group"
      onClick={() => setSelectedAlbum(album)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <img
        src={getImageUrl(album.cover.url) || ''}
        alt={album.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent px-6 py-5"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-white truncate">
          {album.title}
        </h2>
        <p className="text-sm text-slate-300">
          {album.photos.length} {album.photos.length === 1 ? 'photo' : 'photos'}
        </p>
      </motion.div>
    </motion.div>
  ))}
</div>

        ) : (
          // Photo Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {selectedAlbum.photos.map((photo, index) => (
    <motion.div
      key={photo.id}
      className="relative overflow-hidden rounded-3xl cursor-pointer group"
      onClick={() => setSelectedImage(photo)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <img
        src={getImageUrl(photo.formats.medium?.url || photo.url)}
        alt={photo.name}
        className="w-full h-full object-cover rounded-3xl transition-transform duration-300 group-hover:scale-105"
      />

      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent px-4 py-3"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-white text-sm font-medium truncate">{photo.name}</p>
      </motion.div>
    </motion.div>
  ))}
</div>


        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
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
                onClick={() => setSelectedImage(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>

              <img
                src={getImageUrl(selectedImage.formats.large?.url || selectedImage.url)}
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

export default AlbumPage;