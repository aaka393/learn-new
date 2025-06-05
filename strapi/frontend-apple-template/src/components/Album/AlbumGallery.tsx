import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Album } from '../../types/albums';
import { getAlbums } from '../../services/apiService';
import { useGalleryStore } from '../../store/galleryStore';
import { baseUrl } from '../../constants/appConstants';

const AlbumGallery: React.FC = () => {
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
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 pt-20 pb-12">
            {/* Header */}
            <div className="bg-gray-900 text-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Album
                    </motion.h1>
                    <motion.p
                        className="text-xl text-gray-300 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        Explore our collection of images showcasing our work and projects
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {!selectedAlbum ? (
                    // Album Grid View
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {albums.map((album) => (
                                <motion.div
                                    key={album.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                                    onClick={() => setSelectedAlbum(album)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="relative pb-[66.67%]">
                                        <img
                                            src={getImageUrl(album.cover.url) || ''}
                                            alt={album.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h2 className="text-xl font-semibold text-gray-900">{album.title}</h2>
                                        <p className="text-gray-600 mt-1">
                                            {album.photos.length} {album.photos.length === 1 ? 'photo' : 'photos'}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                ) : (
                    // Photo Grid View
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">{selectedAlbum.title}</h1>
                            <button
                                onClick={() => setSelectedAlbum(null)}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Back to Albums
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedAlbum.photos.map((photo) => (
                                <motion.div
                                    key={photo.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                                    onClick={() => setSelectedImage(photo)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="relative pb-[66.67%]">
                                        <img
                                            src={getImageUrl(photo.formats.medium?.url || photo.url)}
                                            alt={photo.name}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <p className="text-gray-900 truncate">{photo.name}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" onClick={(e) => e.stopPropagation()}>
                            <motion.button
                                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                                onClick={() => setSelectedImage(null)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X size={24} />
                            </motion.button>

                            <motion.img
                                src={getImageUrl(selectedImage.formats.large?.url || selectedImage.url)}
                                alt={selectedImage.name}
                                className="max-h-[80vh] mx-auto object-contain"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                            />

                            <motion.div
                                className="absolute bottom-4 left-0 right-0 text-center text-white"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                            >
                                <p className="text-lg">{selectedImage.name}</p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AlbumGallery;