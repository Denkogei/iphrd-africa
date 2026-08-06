// OurEvents.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight, 
  Search, 
  Video,
  Heart,
  Handshake,
  CalendarCheck,
  CalendarX,
  CalendarDays
} from 'lucide-react';

const API_BASE_URL = 'https://trial.iphrdafrica.org';

const OurEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('✅ Events fetched from API:', data);
      
      if (data && data.length > 0) {
        setEvents(data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('❌ Error fetching events:', error);
      setEvents([]);
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
      case 'our-events': return <Heart className="w-5 h-5" />;
      case 'exposure': return <Handshake className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
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
    // If date_display exists from backend, use it
    if (event.date_display) {
      return event.date_display;
    }
    
    // Check for multi-day event
    if (event.is_multi_day && event.start_date && event.end_date) {
      const start = new Date(event.start_date);
      const end = new Date(event.end_date);
      const startFormatted = start.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      const endFormatted = end.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      return `${startFormatted} - ${endFormatted}`;
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

  // Filter events by category and search term
  const filteredEvents = events.filter(event => {
    const matchesCategory = activeCategory === 'all' || event.event_type === activeCategory;
    const matchesSearch = (event.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (event.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (event.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Split events into upcoming and past
  const upcomingEvents = filteredEvents
    .filter(event => isUpcoming(event))
    .sort((a, b) => {
      const dateA = new Date(a.start_date || a.event_date);
      const dateB = new Date(b.start_date || b.event_date);
      return dateA - dateB;
    });

  const pastEvents = filteredEvents
    .filter(event => !isUpcoming(event))
    .sort((a, b) => {
      const dateA = new Date(a.start_date || a.event_date);
      const dateB = new Date(b.start_date || b.event_date);
      return dateB - dateA;
    });

  const getUniqueCategories = () => {
    const types = ['all', ...new Set(events.map(e => e.event_type).filter(Boolean))];
    return types;
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  // Full-width Event Card
  const EventCard = ({ event, index }) => {
    const isEventUpcoming = isUpcoming(event);
    const imageUrl = getImageUrl(event);
    const eventTypeLabel = getEventTypeLabel(event.event_type);
    const eventTypeIcon = getEventTypeIcon(event.event_type);
    const eventTypeColor = getEventTypeColor(event.event_type);
    const dateDisplay = formatEventDate(event);
    const isMultiDay = event.is_multi_day || (event.start_date && event.end_date && event.start_date !== event.end_date);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -4 }}
        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer w-full"
        onClick={() => handleEventClick(event.id)}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className={`relative md:w-1/3 lg:w-1/4 h-56 md:h-auto flex-shrink-0 ${eventTypeColor}`}>
            {imageUrl ? (
              <img 
                src={imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const parent = e.target.parentElement;
                  const fallback = document.createElement('div');
                  fallback.className = 'w-full h-full flex items-center justify-center opacity-30';
                  fallback.innerHTML = `
                    ${eventTypeIcon.type}
                    <span class="ml-2 text-white font-medium text-lg">${eventTypeLabel}</span>
                  `;
                  parent.appendChild(fallback);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-30">
                {eventTypeIcon}
                <span className="ml-2 text-white font-medium text-lg">
                  {eventTypeLabel}
                </span>
              </div>
            )}
            
            {/* Badges positioned on image */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5">
              <div className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${eventTypeColor} shadow-md flex items-center gap-1`}>
                {eventTypeIcon}
                <span className="text-[10px]">{event.event_type === 'our-events' ? 'Our Event' : 'Exposure'}</span>
              </div>
              {isMultiDay && (
                <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500 text-white shadow-md flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  <span className="text-[10px]">Multi-Day</span>
                </div>
              )}
              {event.meeting_link && (
                <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/95 text-gray-700 shadow-md flex items-center gap-1">
                  <Video className="w-3 h-3 text-blue-500" />
                  <span className="text-[10px]">Virtual</span>
                </div>
              )}
            </div>

            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-medium shadow-md flex items-center gap-1 ${
              isEventUpcoming ? 'bg-green-500 text-white' : 'bg-gray-600 text-white'
            }`}>
              {isEventUpcoming ? <CalendarCheck className="w-3 h-3" /> : <CalendarX className="w-3 h-3" />}
              {isEventUpcoming ? 'Upcoming' : 'Past'}
            </div>

            {/* Lighter gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent md:bg-gradient-to-r md:from-black/20 md:to-transparent" />
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 group-hover:text-iphrd-blue-600 transition-colors">
                {event.title}
              </h3>
              
              {/* Description - Added text-justify here */}
              <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-3 text-justify">
                {event.description}
              </p>
              
              {/* Event Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  {isMultiDay ? <CalendarDays className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                  <span>{dateDisplay}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
                {event.time && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{event.time}</span>
                  </div>
                )}
                {event.attendees > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{event.attendees} attendees</span>
                  </div>
                )}
              </div>
            </div>

            {/* View Details Button */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
              <button 
                className="inline-flex items-center gap-2 text-iphrd-blue-600 hover:text-iphrd-blue-700 font-medium group"
              >
                <span>View Details</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-iphrd-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500">Loading events...</p>
        </div>
      </div>
    );
  }

  const hasUpcomingEvents = upcomingEvents.length > 0;
  const hasPastEvents = pastEvents.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-iphrd-blue-600 to-iphrd-blue-700 text-white py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Events</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Discover events organized by IPHRD-Africa. Join us in our mission 
            to promote peace, human rights, and development across Africa.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {getUniqueCategories().map((type) => (
              <button
                key={type}
                onClick={() => setActiveCategory(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  activeCategory === type
                    ? 'bg-iphrd-blue-600 text-white shadow-lg shadow-iphrd-blue-600/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type !== 'all' && getEventTypeIcon(type)}
                {type === 'all' ? 'All Events' : getEventTypeLabel(type)}
              </button>
            ))}
          </div>

          {/* Search Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-iphrd-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Events - Full Width Vertical Layout */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No events found</h3>
            <p className="text-gray-400">
              {searchTerm || activeCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No events available. Check back later for updates.'}
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Upcoming Events Section */}
            {hasUpcomingEvents && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <CalendarCheck className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {upcomingEvents.length}
                  </span>
                </div>
                <div className="space-y-5">
                  {upcomingEvents.map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Events Section */}
            {hasPastEvents && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <CalendarX className="w-6 h-6 text-gray-500" />
                  <h2 className="text-2xl font-bold text-gray-800">Past Events</h2>
                  <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {pastEvents.length}
                  </span>
                </div>
                <div className="space-y-5">
                  {pastEvents.map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OurEvents;