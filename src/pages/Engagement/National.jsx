// src/pages/Engagements/National.jsx (or wherever this lives)
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Calendar, MapPin, Youtube, X, Play, ExternalLink,
  Building2, Home, Clock, Tag, Flag, Users, Globe,
} from 'lucide-react';

const API_BASE_URL = 'https://trial.iphrdafrica.org';

// Single source of truth per level
const LEVEL_CONFIG = {
  global: {
    label: 'GLOBAL',
    Icon: Globe,
    accent: 'blue',
    bgSoft: 'bg-blue-50',
    bgStrong: 'bg-blue-600',
    text: 'text-blue-600',
    textSoft: 'text-blue-400',
    gradient: 'from-blue-50 to-blue-100',
    hover: 'hover:text-blue-600',
    badgeRing: 'ring-blue-600/20',
  },
  regional: {
    label: 'REGIONAL',
    Icon: Globe,
    accent: 'green',
    bgSoft: 'bg-green-50',
    bgStrong: 'bg-green-600',
    text: 'text-green-600',
    textSoft: 'text-green-400',
    gradient: 'from-green-50 to-green-100',
    hover: 'hover:text-green-600',
    badgeRing: 'ring-green-600/20',
  },
  national: {
    label: 'NATIONAL',
    Icon: Flag,
    accent: 'purple',
    bgSoft: 'bg-purple-50',
    bgStrong: 'bg-purple-600',
    text: 'text-purple-600',
    textSoft: 'text-purple-400',
    gradient: 'from-purple-50 to-purple-100',
    hover: 'hover:text-purple-600',
    badgeRing: 'ring-purple-600/20',
  },
  community: {
    label: 'COMMUNITY',
    Icon: Users,
    accent: 'orange',
    bgSoft: 'bg-orange-50',
    bgStrong: 'bg-orange-600',
    text: 'text-orange-600',
    textSoft: 'text-orange-400',
    gradient: 'from-orange-50 to-orange-100',
    hover: 'hover:text-orange-600',
    badgeRing: 'ring-orange-600/20',
  },
};

const getLevelConfig = (level) => LEVEL_CONFIG[level] || LEVEL_CONFIG.national;

function National({ level = 'national' }) {
  const config = getLevelConfig(level);
  const { label, Icon: LevelIcon, bgStrong, bgSoft, text, textSoft, gradient, hover } = config;

  const [engagements, setEngagements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchEngagements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  // Lock scroll + close on ESC when video open
  useEffect(() => {
    if (!selectedVideo) return;
    const onKey = (e) => e.key === 'Escape' && setSelectedVideo(null);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = 'auto';
    };
  }, [selectedVideo]);

  const fetchEngagements = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/engagements/level/${level}`);
      setEngagements(data);
    } catch (error) {
      console.error(`Error fetching ${level} engagements:`, error);
      setEngagements([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ongoing': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming': return <Clock className="w-3 h-3" />;
      case 'ongoing': return <Play className="w-3 h-3" />;
      default: return null;
    }
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&]+)/,
      /(?:youtu\.be\/)([^?]+)/,
      /(?:youtube\.com\/embed\/)([^?]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeId(url);
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const getImageUrl = (engagement) => {
    const raw =
      engagement.image_url ||
      engagement.image ||
      engagement.cover_image ||
      engagement.thumbnail ||
      null;
    if (!raw) return null;
    if (/^https?:\/\//i.test(raw)) return raw;
    return `${API_BASE_URL}${raw.startsWith('/') ? '' : '/'}${raw}`;
  };

  const openVideoModal = (youtubeLink) => {
    const videoId = getYouTubeId(youtubeLink);
    if (videoId) setSelectedVideo(videoId);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-iphrd-green border-t-transparent mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading {level} engagements...</p>
        </div>
      </div>
    );
  }

  // ===== EMPTY =====
  if (engagements.length === 0) {
    return (
      <div className="text-center py-20">
        <div className={`w-24 h-24 mx-auto ${bgSoft} rounded-full flex items-center justify-center mb-6`}>
          <LevelIcon className={`w-12 h-12 ${textSoft}`} />
        </div>
        <h3 className="text-2xl font-semibold text-gray-700">No {level} engagements</h3>
        <p className="text-gray-400 mt-2">Check back later for {level} engagements.</p>
      </div>
    );
  }

  // ===== LIST =====
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {engagements.map((engagement) => {
          const youtubeThumb = engagement.youtube_link
            ? getYouTubeThumbnail(engagement.youtube_link)
            : null;
          const uploadedImage = getImageUrl(engagement);
          const displayImage = uploadedImage || youtubeThumb || null;

          return (
            <div
              key={engagement.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1 flex flex-col"
            >
              {/* ===== IMAGE ===== */}
              <div className="relative w-full h-60 bg-gray-100 overflow-hidden flex-shrink-0">
                {displayImage ? (
                  <>
                    <img
                      src={displayImage}
                      alt={engagement.title}
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                      onError={(e) => {
                        if (uploadedImage && youtubeThumb && e.target.src !== youtubeThumb) {
                          e.target.src = youtubeThumb;
                        } else {
                          e.target.style.display = 'none';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                    {engagement.youtube_link && (
                      <>
                        <div
                          onClick={() => openVideoModal(engagement.youtube_link)}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer z-10"
                        >
                          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
                            <Play className="w-10 h-10 text-white ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg z-10">
                          <Youtube className="w-4 h-4" />
                          YouTube
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradient}`}>
                    <LevelIcon className={`w-20 h-20 ${textSoft}`} />
                  </div>
                )}

                {/* Level Badge — icon + text, no flag emoji */}
                <div
                  className={`absolute top-4 left-4 ${bgStrong} text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg tracking-wider z-10 flex items-center gap-1.5`}
                >
                  <LevelIcon className="w-3.5 h-3.5" />
                  {label}
                </div>

                {/* Status Badge */}
                <div
                  className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg flex items-center gap-1.5 border z-10 ${getStatusColor(
                    engagement.status
                  )}`}
                >
                  {getStatusIcon(engagement.status)}
                  {engagement.status || 'upcoming'}
                </div>
              </div>

              {/* ===== BODY ===== */}
              <div className="p-5 flex flex-col flex-1">
                <h3
                  className={`font-bold text-gray-800 text-lg mb-2 line-clamp-2 transition ${hover}`}
                >
                  {engagement.title}
                </h3>

                <p className="text-sm text-gray-500 mb-4 leading-relaxed whitespace-pre-line">
                  {engagement.description}
                </p>

                <div className="space-y-2.5 text-sm border-t border-gray-100 pt-3 mt-auto">
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
                      <div className={`p-1.5 ${bgSoft} rounded-lg`}>
                        <Tag className={`w-4 h-4 ${text} flex-shrink-0`} />
                      </div>
                      <span
                        className={`px-2.5 py-0.5 ${bgSoft} ${text} text-xs rounded-full capitalize font-medium`}
                      >
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

      {/* ===== VIDEO MODAL ===== */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-14 right-0 text-white hover:text-gray-300 transition flex items-center gap-2"
            >
              <span className="text-sm font-medium">Close</span>
              <X className="w-6 h-6" />
            </button>

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
              <span>
                Press{' '}
                <kbd className="px-2 py-1 bg-white/10 rounded text-xs">ESC</kbd>{' '}
                to close
              </span>
              <span>or click outside</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default National;