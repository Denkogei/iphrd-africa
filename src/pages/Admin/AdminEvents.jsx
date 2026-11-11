// src/pages/Admin/AdminEvents.jsx
import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Plus, Edit, Trash2, X, Calendar, Image as ImageIcon,
  LayoutDashboard, Newspaper, BookOpen, Briefcase, Users,
  Settings, LogOut, Menu, Bell, UserCircle, Search,
  MapPin, Clock, Video, Heart, Handshake, Upload, Eye,
  CalendarDays, CalendarRange
} from 'lucide-react';

const API_BASE_URL = 'https://trial.iphrdafrica.org';

function AdminEvents() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    is_multi_day: false,
    date_display: '',
    time: '',
    location: '',
    category: 'Conference',
    status: 'upcoming',
    event_type: 'our-events',
    meeting_link: '',
    attendees: 0,
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/admin', exact: true, color: 'text-iphrd-green' },
    { name: 'News', icon: Newspaper, path: '/admin/news', color: 'text-blue-500' },
    { name: 'Blog', icon: BookOpen, path: '/admin/blog', color: 'text-purple-500' },
    { name: 'Our Events', icon: Calendar, path: '/admin/events', color: 'text-orange-500' },
    { name: 'Opportunities', icon: Briefcase, path: '/admin/opportunities', color: 'text-iphrd-green' },
    { name: 'Applications', icon: Users, path: '/admin/applications', color: 'text-pink-500' },
    { name: 'Gallery', icon: ImageIcon, path: '/admin/gallery', color: 'text-indigo-500' },
    { name: 'Settings', icon: Settings, path: '/admin/settings', color: 'text-gray-500' },
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events`, {
        withCredentials: true
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const openCreateForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      is_multi_day: false,
      date_display: '',
      time: '',
      location: '',
      category: 'Conference',
      status: 'upcoming',
      event_type: 'our-events',
      meeting_link: '',
      attendees: 0,
      image: null
    });
    setPreviewUrl(null);
    setShowForm(true);
  };

  const openEditForm = (event) => {
    setEditingId(event.id);
    setFormData({
      title: event.title,
      description: event.description,
      start_date: event.start_date || event.event_date || '',
      end_date: event.end_date || '',
      is_multi_day: event.is_multi_day || false,
      date_display: event.date_display || '',
      time: event.time || '',
      location: event.location || '',
      category: event.category || 'Conference',
      status: event.status || 'upcoming',
      event_type: event.event_type || 'our-events',
      meeting_link: event.meeting_link || '',
      attendees: event.attendees || 0,
      image: null
    });
    setPreviewUrl(event.image_url || null);
    setShowForm(true);
  };

  const generateDateDisplay = (startDate, endDate, isMultiDay) => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    const startFormatted = start.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    
    if (!isMultiDay || !endDate || endDate === startDate) {
      return startFormatted;
    }
    
    const end = new Date(endDate);
    const endFormatted = end.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    
    return `${startFormatted} - ${endFormatted}`;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  let dateDisplay = formData.date_display;
  if (!dateDisplay && formData.start_date) {
    dateDisplay = generateDateDisplay(
      formData.start_date, 
      formData.end_date, 
      formData.is_multi_day
    );
  }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('event_date', formData.start_date);
    formDataToSend.append('start_date', formData.start_date);
    formDataToSend.append('end_date', formData.end_date || formData.start_date);
    formDataToSend.append('is_multi_day', formData.is_multi_day);
    formDataToSend.append('date_display', dateDisplay);
    formDataToSend.append('time', formData.time);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('event_type', formData.event_type);
    formDataToSend.append('meeting_link', formData.meeting_link);
    formDataToSend.append('attendees', formData.attendees);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const url = editingId 
        ? `${API_BASE_URL}/api/admin/events/${editingId}`
        : `${API_BASE_URL}/api/admin/events`;
      const method = editingId ? 'put' : 'post';

      await axios({
        method: method,
        url: url,
        data: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      toast.success(editingId ? 'Event updated successfully!' : 'Event created successfully!');
      setShowForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.error || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/events/${deleteId}`, {
        withCredentials: true
      });
      toast.success('Event deleted successfully!');
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchEvents();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isUpcoming = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) >= new Date();
  };

  const filteredEvents = events.filter(event => {
    const eventDate = event.start_date || event.event_date;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || event.event_type === filterType;
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const colors = {
      upcoming: 'bg-green-100 text-green-700',
      ongoing: 'bg-blue-100 text-blue-700',
      completed: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getTypeIcon = (type) => {
    return type === 'our-events' ? <Heart className="w-4 h-4" /> : <Handshake className="w-4 h-4" />;
  };

  const getTypeLabel = (type) => {
    return type === 'our-events' ? 'Our Event' : 'Exposure Learning';
  };

  const formatDateDisplay = (event) => {
    if (event.date_display) {
      return event.date_display;
    }
    if (event.start_date && event.end_date && event.start_date !== event.end_date) {
      const start = new Date(event.start_date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      const end = new Date(event.end_date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      return `${start} - ${end}`;
    }
    const date = event.start_date || event.event_date;
    if (date) {
      return new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iphrd-green mx-auto mb-4"></div>
          <p className="text-gray-500">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 z-30 w-80 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-6 border-b border-gray-100 bg-gradient-to-r from-iphrd-green to-iphrd-blue">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">I</span>
            </div>
            <div>
              <span className="font-bold text-white text-lg">IPHRD-Africa</span>
              <p className="text-white/70 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-iphrd-green to-iphrd-blue rounded-xl flex items-center justify-center shadow-md">
              <UserCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-800">{user?.username}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">Main Menu</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 mb-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-iphrd-green/10 to-iphrd-blue/10 text-iphrd-green shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-100 bg-white">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-xl transition">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="lg:ml-80 min-h-screen">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 lg:px-8">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 lg:hidden">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-5 h-5 text-gray-500" />
              </button>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-iphrd-green to-iphrd-blue rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{user?.username?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-sm text-gray-600 hidden sm:block">{user?.username}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-orange-500" />
                Our Events
              </h1>
              <p className="text-gray-500">Manage events displayed on the public website</p>
            </div>
            <button
              onClick={openCreateForm}
              className="px-4 py-2 bg-iphrd-green text-white rounded-lg hover:bg-iphrd-green/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{events.length}</p>
              <p className="text-xs text-gray-500">Total Events</p>
            </div>
            <div className="bg-white rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {events.filter(e => e.status === 'upcoming' || isUpcoming(e.start_date || e.event_date)).length}
              </p>
              <p className="text-xs text-gray-500">Upcoming</p>
            </div>
            <div className="bg-white rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-gray-600">
                {events.filter(e => e.status === 'completed' || !isUpcoming(e.start_date || e.event_date)).length}
              </p>
              <p className="text-xs text-gray-500">Past Events</p>
            </div>
            <div className="bg-white rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">
                {events.filter(e => e.event_type === 'exposure').length}
              </p>
              <p className="text-xs text-gray-500">Exposure Learning</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg border p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-iphrd-green outline-none"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-iphrd-green outline-none"
              >
                <option value="all">All Types</option>
                <option value="our-events">Our Events</option>
                <option value="exposure">Exposure Learning</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-iphrd-green outline-none"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No events found</p>
                <p className="text-sm text-gray-400">Click "Add Event" to create your first event</p>
              </div>
            ) : (
              filteredEvents.map(event => {
                const eventIsUpcoming = isUpcoming(event.start_date || event.event_date);
                const dateDisplay = formatDateDisplay(event);
                return (
                  <div key={event.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition">
                    <div className="flex items-start gap-4">
                      {/* Image - FIXED */}
                      <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {event.image_url ? (
                          <img 
                            src={event.image_url.startsWith('http') ? event.image_url : `${API_BASE_URL}${event.image_url}`} 
                            alt={event.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const parent = e.target.parentElement;
                              const fallback = document.createElement('div');
                              fallback.className = 'w-full h-full flex items-center justify-center text-gray-300';
                              fallback.innerHTML = '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                              parent.appendChild(fallback);
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Calendar className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 flex items-center gap-1">
                                {getTypeIcon(event.event_type)}
                                {getTypeLabel(event.event_type)}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(event.status)}`}>
                                {event.status}
                              </span>
                              {event.is_multi_day && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 flex items-center gap-1">
                                  <CalendarDays className="w-3 h-3" />
                                  Multi-Day
                                </span>
                              )}
                              {eventIsUpcoming ? (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                  Upcoming
                                </span>
                              ) : (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                  Past Event
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold text-gray-800 truncate">{event.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">{event.description}</p>
                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                {event.is_multi_day ? <CalendarDays className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                                {dateDisplay}
                              </span>
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </span>
                              )}
                              {event.time && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {event.time}
                                </span>
                              )}
                              {event.meeting_link && (
                                <span className="flex items-center gap-1 text-blue-600">
                                  <Video className="w-3 h-3" />
                                  Virtual
                                </span>
                              )}
                              {event.attendees > 0 && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {event.attendees} attendees
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4 flex-shrink-0">
                            <button
                              onClick={() => openEditForm(event)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => confirmDelete(event.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold">{editingId ? 'Edit Event' : 'Add New Event'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Event Type *</label>
                  <select
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-iphrd-green outline-none"
                  >
                    <option value="our-events">Our Events</option>
                    <option value="exposure">Exposure Learning & Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-iphrd-green outline-none"
                  >
                    <option value="Conference">Conference</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Training">Training</option>
                    <option value="Dialogue">Dialogue</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-iphrd-green outline-none"
                  placeholder="e.g., Annual Peace Conference 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-iphrd-green outline-none"
                  placeholder="Describe the event..."
                />
              </div>

              {/* Multi-Day Event Toggle */}
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  name="is_multi_day"
                  id="is_multi_day"
                  checked={formData.is_multi_day}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-gray-300 text-iphrd-green focus:ring-iphrd-green"
                />
                <label htmlFor="is_multi_day" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-purple-500" />
                  This is a multi-day event
                </label>
                <span className="text-xs text-gray-400">
                  (Check if event spans multiple days)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {formData.is_multi_day ? 'Start Date *' : 'Event Date *'}
                    <span className="text-xs text-gray-400 ml-2">
                      (Past or future dates allowed)
                    </span>
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    required
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-iphrd-green outline-none"
                  />
                </div>
                {formData.is_multi_day && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      End Date *
                      <span className="text-xs text-gray-400 ml-2">
                        (Must be after start date)
                      </span>
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      required={formData.is_multi_day}
                      value={formData.end_date}
                      onChange={handleInputChange}
                      min={formData.start_date}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-iphrd-green outline-none"
                    />
                  </div>
                )}
              </div>

              {formData.start_date && formData.is_multi_day && formData.end_date && (
                <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded-lg border border-blue-200">
                  <span className="font-medium">📅 Date Display:</span>{' '}
                  {new Date(formData.start_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })} - {new Date(formData.end_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="text"
                  name="time"
                  placeholder="e.g., 09:00 AM - 05:00 PM"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-iphrd-green outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., Nairobi, Kenya or Virtual"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-iphrd-green outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-iphrd-green outline-none"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expected Attendees</label>
                  <input
                    type="number"
                    name="attendees"
                    min="0"
                    value={formData.attendees}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-iphrd-green outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Meeting Link (for virtual events)</label>
                <input
                  type="url"
                  name="meeting_link"
                  placeholder="https://zoom.us/meeting/..."
                  value={formData.meeting_link}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-iphrd-green outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Event Banner/Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-iphrd-green transition cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="eventImageInput"
                  />
                  <label htmlFor="eventImageInput" className="cursor-pointer block">
                    {previewUrl ? (
                      <div className="relative">
                        <img 
                          src={previewUrl.startsWith('http') ? previewUrl : `${API_BASE_URL}${previewUrl}`} 
                          alt="Preview" 
                          className="max-h-48 mx-auto rounded-lg" 
                        />
                        <p className="text-sm text-green-600 mt-2">✓ Image uploaded</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewUrl(null);
                            setFormData({ ...formData, image: null });
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-gray-400 mb-2">
                          <Upload className="w-10 h-10 mx-auto" />
                        </div>
                        <p className="text-gray-500">Click to upload event banner</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG, WebP up to 5MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-iphrd-green text-white px-4 py-2 rounded-lg hover:bg-iphrd-green/90 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : (editingId ? 'Update Event' : 'Create Event')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Delete Event</h3>
              <p className="text-gray-600 mb-4">Are you sure you want to delete this event? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminEvents;