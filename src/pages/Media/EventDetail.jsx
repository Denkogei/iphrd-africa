// EventDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowLeft,
  CalendarCheck,
  CalendarX,
  Video,
  ExternalLink,
  Heart,
  BookOpen,
  Handshake,
  Share2,
  Copy,
  Check,
  CalendarDays
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';

const API_BASE_URL = 'https://trial.iphrdafrica.org';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`📡 Fetching event ${id}... Status: ${response.status}`);

      if (response.status === 404) {
        setError('Event not found');
        setEvent(null);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Event data received:', data);
      
      if (data && data.id) {
        setEvent(data);
      } else {
        setError('Event data is invalid');
        setEvent(null);
      }
    } catch (error) {
      console.error('❌ Error fetching event:', error);
      setError('Failed to load event details. Please try again later.');
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeLabel = (type) => {
    switch(type) {
      case 'our-events': return 'Our Events';
      case 'exposure': return 'Exposure Learning & Partnership';
      default: return 'Events';
    }
  };

  const getEventTypeIcon = (type) => {
    switch(type) {
      case 'our-events': return <Heart className="w-6 h-6" />;
      case 'exposure': return <Handshake className="w-6 h-6" />;
      default: return <Calendar className="w-6 h-6" />;
    }
  };

  const getEventTypeColor = (type) => {
    switch(type) {
      case 'our-events': return 'bg-iphrd-blue-600';
      case 'exposure': return 'bg-iphrd-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Format date - handles both single and multi-day events
  const formatEventDate = (event) => {
    if (!event) return 'Date TBD';
    
    // If date_display exists from backend, use it
    if (event.date_display) {
      return event.date_display;
    }
    
    // Check for multi-day event using start_date and end_date
    if (event.start_date && event.end_date && event.start_date !== event.end_date) {
      const start = new Date(event.start_date);
      const end = new Date(event.end_date);
      
      // Check if it's the same month
      if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        // Same month: "Jul 27-28, 2026"
        const month = start.toLocaleDateString('en-US', { month: 'short' });
        const day1 = start.getDate();
        const day2 = end.getDate();
        const year = start.getFullYear();
        return `${month} ${day1}-${day2}, ${year}`;
      } else {
        // Different months: "Jul 27 - Aug 2, 2026"
        const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return `${startStr} - ${endStr}`;
      }
    }
    
    // Single day event - use start_date or fallback to event_date
    const dateString = event.start_date || event.event_date;
    if (!dateString) return 'Date TBD';
    
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get detailed date display for the sidebar
  const getDetailedDateDisplay = (event) => {
    if (!event) return 'Date TBD';
    
    // If date_display exists, use it
    if (event.date_display) {
      return event.date_display;
    }
    
    if (event.start_date && event.end_date && event.start_date !== event.end_date) {
      const start = new Date(event.start_date);
      const end = new Date(event.end_date);
      const startStr = start.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const endStr = end.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      return `${startStr} - ${endStr}`;
    }
    
    const dateString = event.start_date || event.event_date;
    if (!dateString) return 'Date TBD';
    
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Check if event is upcoming
  const isUpcoming = (event) => {
    const dateString = event.start_date || event.event_date;
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(dateString);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  // Get the correct image URL
  const getImageUrl = (event) => {
    if (!event || !event.image) return null;
    if (event.image.startsWith('http')) return event.image;
    if (event.image.startsWith('/uploads/')) return `${API_BASE_URL}${event.image}`;
    return `${API_BASE_URL}/uploads/events/${event.image}`;
  };

  const copyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleBack = () => {
    navigate('/media/our-events');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-iphrd-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-500">Loading event details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto px-4">
            <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Event not found</h3>
            <p className="text-gray-400">
              {error || "The event you're looking for doesn't exist or has been removed."}
            </p>
            <button 
              onClick={handleBack}
              className="mt-4 inline-block bg-iphrd-blue-600 text-white px-6 py-2 rounded-lg hover:bg-iphrd-blue-700 transition"
            >
              Back to Events
            </button>
          </div>
        </div>
      </>
    );
  }

  const isEventUpcoming = isUpcoming(event);
  const imageUrl = getImageUrl(event);
  const dateDisplay = formatEventDate(event);
  const detailedDateDisplay = getDetailedDateDisplay(event);
  const isMultiDay = event.is_multi_day || (event.start_date && event.end_date && event.start_date !== event.end_date);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <button 
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-iphrd-blue-600 transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            Back to Events
          </button>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pb-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Hero Image */}
            <div className={`relative h-80 ${getEventTypeColor(event.event_type)}`}>
              {imageUrl ? (
                <img 
                  src={imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full flex flex-col items-center justify-center opacity-30';
                    fallback.innerHTML = `
                      ${getEventTypeIcon(event.event_type).type}
                      <span class="mt-2 text-white text-xl font-medium">${getEventTypeLabel(event.event_type)}</span>
                    `;
                    parent.appendChild(fallback);
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                  {getEventTypeIcon(event.event_type)}
                  <span className="mt-2 text-white text-xl font-medium">
                    {getEventTypeLabel(event.event_type)}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white ${getEventTypeColor(event.event_type)}`}>
                    {getEventTypeIcon(event.event_type)}
                    {getEventTypeLabel(event.event_type)}
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-medium text-white ${
                    isEventUpcoming ? 'bg-green-500' : 'bg-gray-500'
                  }`}>
                    {isEventUpcoming ? 'Upcoming' : 'Past'}
                  </div>
                  {isMultiDay && (
                    <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-purple-500 text-white flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      Multi-Day
                    </div>
                  )}
                  {event.meeting_link && (
                    <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500 text-white flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      Virtual
                    </div>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{event.title}</h1>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">About This Event</h2>
                    {/* Added text-justify here */}
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line text-justify">
                      {event.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Category</h3>
                    <span className="inline-block bg-gray-100 text-gray-700 text-sm px-4 py-1.5 rounded-full capitalize">
                      {event.category || 'General'}
                    </span>
                  </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-gray-700 text-sm">Event Details</h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-3 text-gray-600">
                        {isMultiDay ? <CalendarDays className="w-4 h-4 text-iphrd-blue-600" /> : <Calendar className="w-4 h-4 text-iphrd-blue-600" />}
                        <span className="font-medium">{detailedDateDisplay}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <Clock className="w-4 h-4 text-iphrd-blue-600" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="w-4 h-4 text-iphrd-blue-600" />
                        <span>{event.location}</span>
                      </div>
                      {event.attendees > 0 && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <Users className="w-4 h-4 text-iphrd-blue-600" />
                          <span>{event.attendees} attendees</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Meeting Link */}
                  {event.meeting_link && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-sm text-blue-700 mb-2">
                        <Video className="w-5 h-5" />
                        <span className="font-medium">Virtual Meeting</span>
                      </div>
                      <a 
                        href={event.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        Join Meeting <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}

                  {/* Share Button */}
                  <button
                    onClick={copyShareLink}
                    className="w-full border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        Share Event
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default EventDetail;