import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Youtube, X, Play, ExternalLink, Clock, Tag } from 'lucide-react';

function Regional() {
  const [engagements, setEngagements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchEngagements();
  }, []);

  const fetchEngagements = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://trial.iphrdafrica.org/api/engagements/level/regional');
      setEngagements(response.data);
    } catch (error) {
      console.error('Error fetching regional engagements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ongoing': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'upcoming': return <Clock className="w-3 h-3" />;
      case 'ongoing': return <Play className="w-3 h-3" />;
      default: return null;
    }
  };

  // Extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&]+)/,
      /(?:youtu\.be\/)([^?]+)/,
      /(?:youtube\.com\/embed\/)([^?]+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Get YouTube thumbnail
  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeId(url);
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // Truncate description to 50 words
  const truncateDescription = (text, wordLimit = 50) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const openVideoModal = (youtubeLink) => {
    const videoId = getYouTubeId(youtubeLink);
    if (videoId) {
      setSelectedVideo(videoId);
    }
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-iphrd-green border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading regional engagements...</p>
        </div>
      </div>
    );
  }

  if (engagements.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6">
          <MapPin className="w-12 h-12 text-green-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-700">No regional engagements</h3>
        <p className="text-gray-400 mt-2">Check back later for regional engagements.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {engagements.map((engagement) => {
          const thumbnail = engagement.youtube_link ? getYouTubeThumbnail(engagement.youtube_link) : null;
          const imageSrc = engagement.image_url || thumbnail || null;
          const truncatedDescription = truncateDescription(engagement.description, 50);
          
          return (
            <div 
              key={engagement.id} 
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1"
            >
              <div className="relative h-60 bg-gray-100 cursor-pointer overflow-hidden">
                {imageSrc ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={imageSrc} 
                      alt={engagement.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      onError={(e) => {
                        if (thumbnail && e.target.src !== thumbnail) {
                          e.target.src = thumbnail;
                        } else {
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
                              <svg class="w-20 h-20 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                              </svg>
                            </div>
                          `;
                        }
                      }}
                    />
                    {/* Gradient overlay for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    
                    {engagement.youtube_link && (
                      <>
                        {/* Play button overlay on hover */}
                        <div 
                          onClick={() => openVideoModal(engagement.youtube_link)}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                        >
                          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
                            <Play className="w-10 h-10 text-white ml-1" />
                          </div>
                        </div>
                        {/* YouTube badge */}
                        <div className="absolute bottom-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                          <Youtube className="w-4 h-4" />
                          YouTube
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
                    <MapPin className="w-20 h-20 text-green-300" />
                  </div>
                )}
                
                {/* Level Badge */}
                <div className="absolute top-4 left-4 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-green-600 shadow-lg tracking-wider">
                  🌍 REGIONAL
                </div>

                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg flex items-center gap-1.5 border ${getStatusColor(engagement.status)}`}>
                  {getStatusIcon(engagement.status)}
                  {engagement.status || 'upcoming'}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 hover:text-green-600 transition">
                  {engagement.title}
                </h3>
                
                {/* Description with 50-word limit */}
                <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-3">
                  {truncatedDescription}
                </p>
                
                <div className="space-y-2.5 text-sm border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2.5 text-gray-600">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    </div>
                    <span className="font-medium">{formatDate(engagement.event_date)}</span>
                  </div>
                  
                  {engagement.location && (
                    <div className="flex items-center gap-2.5 text-gray-600">
                      <div className="p-1.5 bg-green-50 rounded-lg">
                        <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
                      </div>
                      <span>{engagement.location}</span>
                    </div>
                  )}
                  
                  {engagement.category && (
                    <div className="flex items-center gap-2.5 text-gray-600">
                      <div className="p-1.5 bg-green-50 rounded-lg">
                        <Tag className="w-4 h-4 text-green-500 flex-shrink-0" />
                      </div>
                      <span className="px-2.5 py-0.5 bg-green-50 text-green-600 text-xs rounded-full capitalize font-medium">
                        {engagement.category}
                      </span>
                    </div>
                  )}
                </div>

                {engagement.youtube_link && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
                    <button
                      onClick={() => openVideoModal(engagement.youtube_link)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition font-medium text-sm"
                    >
                      <Youtube className="w-4 h-4" />
                      Play Video
                    </button>
                    <a
                      href={engagement.youtube_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open in YouTube
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={closeVideoModal}>
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={closeVideoModal}
              className="absolute -top-14 right-0 text-white hover:text-gray-300 transition flex items-center gap-2"
            >
              <span className="text-sm font-medium">Close</span>
              <X className="w-6 h-6" />
            </button>
            
            {/* Video Player */}
            <div className="relative pt-[56.25%] bg-black rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
            
            <div className="flex justify-center items-center gap-6 mt-4 text-white/60 text-sm">
              <span>Press <kbd className="px-2 py-1 bg-white/10 rounded text-xs">ESC</kbd> to close</span>
              <span>or click outside</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Regional;