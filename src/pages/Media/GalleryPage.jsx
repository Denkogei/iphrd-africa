// GalleryPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image, 
  Grid, 
  LayoutGrid, 
  Calendar, 
  Tag, 
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  FolderOpen,
  Clock
} from 'lucide-react';

// API Base URL
const API_BASE_URL = 'https://trial.iphrdafrica.org';

const GalleryPage = () => {
  const [allImages, setAllImages] = useState([]);
  const [displayedImages, setDisplayedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [events, setEvents] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [eventStats, setEventStats] = useState({});

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/gallery`);
      const images = response.data;
      setAllImages(images);
      
      const eventMap = {};
      images.forEach(img => {
        let eventName = img.title || 'Uncategorized';
        if (eventName.includes(' - Photo') || eventName.includes(' - Image')) {
          eventName = eventName.split(' - ')[0];
        }
        if (eventName.match(/ - \d+$/)) {
          eventName = eventName.replace(/ - \d+$/, '');
        }
        
        if (!eventMap[eventName]) {
          eventMap[eventName] = [];
        }
        eventMap[eventName].push(img);
      });
      
      const sortedEvents = Object.keys(eventMap).sort((a, b) => {
        const dateA = new Date(eventMap[a][0]?.date_uploaded || 0);
        const dateB = new Date(eventMap[b][0]?.date_uploaded || 0);
        return dateB - dateA;
      });
      
      setEvents(sortedEvents);
      
      const stats = {};
      sortedEvents.forEach(event => {
        const eventImages = eventMap[event];
        stats[event] = {
          count: eventImages.length,
          featured: eventImages.filter(img => img.is_featured).length,
          latest: eventImages[0]?.date_uploaded,
          coverImage: eventImages[0]?.image_url || null
        };
      });
      setEventStats(stats);
      
      setDisplayedImages(images);
      
      console.log('Events found:', sortedEvents);
      console.log('Images per event:', eventMap);
      
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventChange = (event) => {
    setSelectedEvent(event);
    if (event === 'all') {
      setDisplayedImages(allImages);
    } else {
      const filtered = allImages.filter(img => {
        let imgEvent = img.title || 'Uncategorized';
        if (imgEvent.includes(' - Photo') || imgEvent.includes(' - Image')) {
          imgEvent = imgEvent.split(' - ')[0];
        }
        if (imgEvent.match(/ - \d+$/)) {
          imgEvent = imgEvent.replace(/ - \d+$/, '');
        }
        return imgEvent === event;
      });
      setDisplayedImages(filtered);
    }
  };

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateLightbox = (direction) => {
    const currentIndex = displayedImages.findIndex(img => img.id === selectedImage.id);
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % displayedImages.length 
      : (currentIndex - 1 + displayedImages.length) % displayedImages.length;
    setSelectedImage(displayedImages[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImage) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') navigateLightbox('next');
        if (e.key === 'ArrowLeft') navigateLightbox('prev');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, displayedImages]);

  const featuredImages = displayedImages.filter(img => img.is_featured);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Pure Green */}
      <div className="relative bg-green-700 text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 flex items-center justify-center gap-3">
            <Image className="w-12 h-12" />
          Gallery
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Explore moments captured from ourand activities
          </p>
          
          {events.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm">
              <FolderOpen className="w-5 h-5" />
              <span className="font-medium">{events.length} Events</span>
              <span className="w-1 h-1 bg-white/40 rounded-full"></span>
              <span className="font-medium">{allImages.length} Photos</span>
            </div>
          )}
        </div>
      </div>

      {/* Event Selection - Event Cards View */}
      {selectedEvent === 'all' ? (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {events.map(event => (
              <motion.div
                key={event}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
                onClick={() => handleEventChange(event)}
              >
                <div className="relative h-64 bg-green-100">
                  {eventStats[event]?.coverImage ? (
                    <img 
                      src={`${API_BASE_URL}${eventStats[event].coverImage}`}
                      alt={event}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-green-50">
                      <FolderOpen className="w-20 h-20 text-green-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                    <div className="text-white w-full">
                      <h3 className="font-bold text-2xl mb-2">{event}</h3>
                      <div className="flex items-center gap-4 text-sm text-white/80">
                        <span className="flex items-center gap-1">
                          <Image className="w-4 h-4" />
                          {eventStats[event]?.count || 0} photos
                        </span>
                        {eventStats[event]?.featured > 0 && (
                          <span className="flex items-center gap-1 text-yellow-300">
                            <Star className="w-4 h-4 fill-yellow-300" />
                            {eventStats[event]?.featured} featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Event Header */}
          <div className="bg-white border-b border-gray-200 py-6 px-4 shadow-sm">
            <div className="container mx-auto flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleEventChange('all')}
                  className="text-green-600 hover:text-green-800 transition flex items-center gap-2 font-medium text-base"
                >
                  ← Back to Events
                </button>
                <div className="h-8 w-px bg-gray-300"></div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedEvent}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Image className="w-4 h-4" />
                      {displayedImages.length} photos
                    </span>
                    {featuredImages.length > 0 && (
                      <span className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-yellow-500" />
                        {featuredImages.length} featured
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* View Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === 'masonry' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Gallery Grid - Larger Cards */}
          <div className="container mx-auto px-4 py-12">
            {displayedImages.length === 0 ? (
              <div className="text-center py-20">
                <Image className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">No images found</h3>
                <p className="text-gray-400">No images available for this event yet.</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence>
                  {displayedImages.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -12 }}
                      className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
                      onClick={() => openLightbox(image)}
                    >
                      <div className="relative h-72 overflow-hidden">
                        <img 
                          src={`${API_BASE_URL}${image.image_url}`}
                          alt={image.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        {image.is_featured && (
                          <div className="absolute top-4 right-4 bg-yellow-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                            <Star className="w-4 h-4 fill-white" />
                            Featured
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                          <div className="text-white">
                            <p className="font-semibold text-lg">{image.title}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-lg text-gray-800 truncate">{image.title}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(image.date_uploaded).toLocaleDateString()}
                          </span>
                          {image.category && (
                            <span className="text-xs text-gray-400 capitalize bg-gray-100 px-3 py-1 rounded-full">
                              {image.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
                <AnimatePresence>
                  {displayedImages.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="break-inside-avoid group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
                      onClick={() => openLightbox(image)}
                    >
                      <div className="relative overflow-hidden">
                        <img 
                          src={`${API_BASE_URL}${image.image_url}`}
                          alt={image.title}
                          className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        {image.is_featured && (
                          <div className="absolute top-4 right-4 bg-yellow-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                            <Star className="w-4 h-4 fill-white" />
                            Featured
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                          <div className="text-white">
                            <p className="font-semibold text-lg">{image.title}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-lg text-gray-800 truncate">{image.title}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(image.date_uploaded).toLocaleDateString()}
                          </span>
                          {image.category && (
                            <span className="text-xs text-gray-400 capitalize bg-gray-100 px-3 py-1 rounded-full">
                              {image.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-8 h-8" />
          </button>

          {displayedImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
                className="absolute left-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
                className="absolute right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </>
          )}

          <div 
            className="max-w-7xl max-h-[85vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={`${API_BASE_URL}${selectedImage.image_url}`}
              alt={selectedImage.title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <h3 className="text-white text-xl font-semibold">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-white/70 text-sm mt-1">{selectedImage.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2">
                <span className="text-white/60 text-xs flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(selectedImage.date_uploaded).toLocaleDateString()}
                </span>
                {selectedImage.is_featured && (
                  <span className="text-yellow-400 text-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>

          {displayedImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
              {displayedImages.findIndex(img => img.id === selectedImage.id) + 1} / {displayedImages.length}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default GalleryPage;