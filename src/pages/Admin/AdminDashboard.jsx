import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Newspaper,
  BookOpen,
  Briefcase,
  Users,
  TrendingUp,
  Eye,
  Clock,
  ArrowRight,
  Plus,
  Image,
  Upload,
  Trash2,
  Edit,
  X,
  Star,
  StarOff,
  Search,
  Grid,
  List,
  Calendar,
  Globe,
  MapPin,
  Building2,
  Home,
  Youtube
} from 'lucide-react';

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalNews: 0,
    totalBlog: 0,
    totalEvents: 0,
    totalOpportunities: 0,
    totalApplications: 0,
    openOpportunities: 0,
    pendingApplications: 0,
    totalGallery: 0,
    totalEngagements: 0,
    globalEngagements: 0,
    regionalEngagements: 0,
    nationalEngagements: 0,
    communityEngagements: 0
  });
  const [recentOpportunities, setRecentOpportunities] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentGalleryImages, setRecentGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: 'event',
    tags: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    isFeatured: false
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingImage, setDeletingImage] = useState(null);
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmTitle, setConfirmTitle] = useState('');

  // Engagement States
  const [engagements, setEngagements] = useState([]);
  const [engagementsLoading, setEngagementsLoading] = useState(false);
  const [showEngagementModal, setShowEngagementModal] = useState(false);
  const [editingEngagement, setEditingEngagement] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [engagementData, setEngagementData] = useState({
    title: '',
    description: '',
    level: 'global',
    event_date: '',
    location: '',
    category: 'Conference',
    status: 'upcoming',
    youtube_link: '',
    image: null,
    imagePreview: null
  });
  const [showEngagementDeleteModal, setShowEngagementDeleteModal] = useState(false);
  const [deletingEngagement, setDeletingEngagement] = useState(null);

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'workshop',
    status: 'upcoming',
    image: null,
    imagePreview: null
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') {
      setActiveTab('overview');
    } else if (path === '/admin/gallery') {
      setActiveTab('gallery');
    } else if (path === '/admin/news') {
      setActiveTab('news');
    } else if (path === '/admin/blog') {
      setActiveTab('blog');
    } else if (path === '/admin/events') {
      setActiveTab('events');
    } else if (path === '/admin/opportunities') {
      setActiveTab('opportunities');
    } else if (path === '/admin/applications') {
      setActiveTab('applications');
    } else if (path === '/admin/engagements') {
      setActiveTab('engagements');
    } else if (path === '/admin/settings') {
      setActiveTab('settings');
    }
  }, [location]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'gallery') {
      fetchGalleryImages();
      fetchCategories();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'events') {
      fetchEvents();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'engagements') {
      fetchEngagements();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [newsRes, blogRes, eventsRes, opportunitiesRes, applicationsRes, galleryRes, engagementsRes] = await Promise.all([
        axios.get('https://trial.iphrdafrica.org/api/news'),
        axios.get('https://trial.iphrdafrica.org/api/blog'),
        axios.get('https://trial.iphrdafrica.org/api/events'),
        axios.get('https://trial.iphrdafrica.org/api/opportunities'),
        axios.get('https://trial.iphrdafrica.org/api/admin/applications', { withCredentials: true }).catch(() => ({ data: [] })),
        axios.get('https://trial.iphrdafrica.org/api/gallery').catch(() => ({ data: [] })),
        axios.get('https://trial.iphrdafrica.org/api/engagements').catch(() => ({ data: [] }))
      ]);

      const opportunities = opportunitiesRes.data;
      const applications = applicationsRes.data || [];
      const galleryImages = galleryRes.data || [];
      const eventsData = eventsRes.data || [];
      const engagementsData = engagementsRes.data || [];

      // Count engagements by level
      const globalCount = engagementsData.filter(e => e.level === 'global').length;
      const regionalCount = engagementsData.filter(e => e.level === 'regional').length;
      const nationalCount = engagementsData.filter(e => e.level === 'national').length;
      const communityCount = engagementsData.filter(e => e.level === 'community').length;

      setStats({
        totalNews: newsRes.data.length,
        totalBlog: blogRes.data.length,
        totalEvents: eventsData.length,
        totalOpportunities: opportunities.length,
        totalApplications: applications.length,
        openOpportunities: opportunities.filter(o => o.status === 'Open').length,
        pendingApplications: applications.filter(a => a.status === 'pending').length,
        totalGallery: galleryImages.length,
        totalEngagements: engagementsData.length,
        globalEngagements: globalCount,
        regionalEngagements: regionalCount,
        nationalEngagements: nationalCount,
        communityEngagements: communityCount
      });

      setRecentOpportunities(opportunities.slice(0, 5));
      setRecentApplications(applications.slice(0, 5));
      setRecentGalleryImages(galleryImages.slice(0, 4));
      setEvents(eventsData.slice(0, 5));
      setEngagements(engagementsData.slice(0, 5));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ==================== ENGAGEMENT FUNCTIONS ====================
  const fetchEngagements = async () => {
    setEngagementsLoading(true);
    try {
      const response = await axios.get('https://trial.iphrdafrica.org/api/engagements');
      setEngagements(response.data);
    } catch (error) {
      console.error('Error fetching engagements:', error);
      toast.error('Failed to load engagements');
    } finally {
      setEngagementsLoading(false);
    }
  };

  const handleEngagementSubmit = async (e) => {
    e.preventDefault();
    setEngagementsLoading(true);

    const formData = new FormData();
    formData.append('title', engagementData.title);
    formData.append('description', engagementData.description);
    formData.append('level', engagementData.level);
    formData.append('event_date', engagementData.event_date);
    formData.append('location', engagementData.location);
    formData.append('category', engagementData.category);
    formData.append('status', engagementData.status);
    formData.append('youtube_link', engagementData.youtube_link);
    if (engagementData.image) {
      formData.append('image', engagementData.image);
    }

    try {
      const url = editingEngagement 
        ? `https://trial.iphrdafrica.org/api/admin/engagements/${editingEngagement.id}`
        : 'https://trial.iphrdafrica.org/api/admin/engagements';
      const method = editingEngagement ? 'put' : 'post';

      await axios({
        method: method,
        url: url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success(editingEngagement ? 'Engagement updated successfully' : 'Engagement created successfully');
      setShowEngagementModal(false);
      resetEngagementForm();
      fetchEngagements();
      fetchDashboardData();
    } catch (error) {
      console.error('Engagement submit error:', error);
      toast.error(error.response?.data?.error || 'Failed to save engagement');
    } finally {
      setEngagementsLoading(false);
    }
  };

  const handleDeleteEngagement = async (engagementId) => {
    try {
      await axios.delete(`https://trial.iphrdafrica.org/api/admin/engagements/${engagementId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success('Engagement deleted successfully');
      fetchEngagements();
      fetchDashboardData();
    } catch (error) {
      console.error('Delete engagement error:', error);
      toast.error('Failed to delete engagement');
    }
  };

  const resetEngagementForm = () => {
    setEngagementData({
      title: '',
      description: '',
      level: 'global',
      event_date: '',
      location: '',
      category: 'Conference',
      status: 'upcoming',
      youtube_link: '',
      image: null,
      imagePreview: null
    });
    setEditingEngagement(null);
  };

  const openEditEngagement = (engagement) => {
    setEditingEngagement(engagement);
    setEngagementData({
      title: engagement.title,
      description: engagement.description || '',
      level: engagement.level || 'global',
      event_date: engagement.event_date || '',
      location: engagement.location || '',
      category: engagement.category || 'Conference',
      status: engagement.status || 'upcoming',
      youtube_link: engagement.youtube_link || '',
      image: null,
      imagePreview: engagement.image_url || null
    });
    setShowEngagementModal(true);
  };

  const getEngagementLevelIcon = (level) => {
    switch(level) {
      case 'global': return <Globe className="w-4 h-4 text-blue-500" />;
      case 'regional': return <MapPin className="w-4 h-4 text-green-500" />;
      case 'national': return <Building2 className="w-4 h-4 text-purple-500" />;
      case 'community': return <Home className="w-4 h-4 text-orange-500" />;
      default: return <Globe className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEngagementLevelColor = (level) => {
    switch(level) {
      case 'global': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'regional': return 'bg-green-50 text-green-600 border-green-200';
      case 'national': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'community': return 'bg-orange-50 text-orange-600 border-orange-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-50 text-blue-600';
      case 'ongoing': return 'bg-green-50 text-green-600';
      case 'completed': return 'bg-gray-50 text-gray-600';
      case 'cancelled': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  // ==================== EVENT FUNCTIONS ====================
  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const response = await axios.get('https://trial.iphrdafrica.org/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setEventsLoading(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setEventsLoading(true);

    const formData = new FormData();
    formData.append('title', eventData.title);
    formData.append('description', eventData.description);
    formData.append('date', eventData.date);
    formData.append('location', eventData.location);
    formData.append('category', eventData.category);
    formData.append('status', eventData.status);
    if (eventData.image) {
      formData.append('image', eventData.image);
    }

    try {
      const url = editingEvent 
        ? `https://trial.iphrdafrica.org/api/admin/events/${editingEvent.id}`
        : 'https://trial.iphrdafrica.org/api/admin/events';
      const method = editingEvent ? 'put' : 'post';

      await axios({
        method: method,
        url: url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success(editingEvent ? 'Event updated successfully' : 'Event created successfully');
      setShowEventModal(false);
      resetEventForm();
      fetchEvents();
      fetchDashboardData();
    } catch (error) {
      console.error('Event submit error:', error);
      toast.error(error.response?.data?.error || 'Failed to save event');
    } finally {
      setEventsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`https://trial.iphrdafrica.org/api/admin/events/${eventId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success('Event deleted successfully');
      fetchEvents();
      fetchDashboardData();
    } catch (error) {
      console.error('Delete event error:', error);
      toast.error('Failed to delete event');
    }
  };

  const resetEventForm = () => {
    setEventData({
      title: '',
      description: '',
      date: '',
      location: '',
      category: 'workshop',
      status: 'upcoming',
      image: null,
      imagePreview: null
    });
    setEditingEvent(null);
  };

  const openEditEvent = (event) => {
    setEditingEvent(event);
    setEventData({
      title: event.title,
      description: event.description || '',
      date: event.date || '',
      location: event.location || '',
      category: event.category || 'workshop',
      status: event.status || 'upcoming',
      image: null,
      imagePreview: event.image_url || null
    });
    setShowEventModal(true);
  };

  // ==================== GALLERY FUNCTIONS ====================
  const fetchGalleryImages = async () => {
    setGalleryLoading(true);
    try {
      const response = await axios.get('https://trial.iphrdafrica.org/api/gallery');
      setGalleryImages(response.data);
      const uniqueCategories = [...new Set(response.data.map(img => img.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast.error('Failed to load gallery images');
    } finally {
      setGalleryLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://trial.iphrdafrica.org/api/gallery/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    formData.append('eventName', uploadData.title);
    formData.append('eventDate', new Date().toISOString().split('T')[0]);
    formData.append('category', uploadData.category);
    formData.append('tags', uploadData.tags);

    try {
      const response = await axios.post(
        'https://trial.iphrdafrica.org/api/admin/gallery/bulk',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      toast.success(response.data.message || 'Images uploaded successfully');
      setShowUploadModal(false);
      resetUploadForm();
      fetchGalleryImages();
      setStats(prev => ({ ...prev, totalGallery: prev.totalGallery + response.data.uploaded_count }));
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setSelectedFiles([]);
    setPreviewUrls([]);
    setUploadData({
      title: '',
      description: '',
      category: 'event',
      tags: ''
    });
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setEditData({
      title: image.title,
      description: image.description || '',
      category: image.category || 'event',
      tags: image.tags?.join(', ') || '',
      isFeatured: image.isFeatured || false
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `https://trial.iphrdafrica.org/api/admin/gallery/${editingImage.id}`,
        {
          title: editData.title,
          description: editData.description,
          category: editData.category,
          tags: editData.tags,
          isFeatured: editData.isFeatured
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      toast.success('Image updated successfully');
      setShowEditModal(false);
      fetchGalleryImages();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update image');
    }
  };

  const handleDelete = async () => {
    if (!deletingImage) return;
    try {
      await axios.delete(
        `https://trial.iphrdafrica.org/api/admin/gallery/${deletingImage.id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      toast.success('Image deleted successfully');
      setShowDeleteModal(false);
      setDeletingImage(null);
      fetchGalleryImages();
      setStats(prev => ({ ...prev, totalGallery: prev.totalGallery - 1 }));
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      toast.error('No images selected');
      return;
    }
    
    setConfirmTitle('Delete Images');
    setConfirmMessage(`Are you sure you want to delete ${selectedIds.length} selected images? This action cannot be undone.`);
    setConfirmAction(() => handleBulkDeleteConfirmed);
    setShowConfirmModal(true);
  };

  const handleBulkDeleteConfirmed = async () => {
    setShowConfirmModal(false);
    try {
      await axios.post(
        'https://trial.iphrdafrica.org/api/admin/gallery/bulk-delete',
        { image_ids: selectedIds },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      toast.success(`${selectedIds.length} images deleted successfully`);
      setSelectedIds([]);
      setBulkDeleteMode(false);
      fetchGalleryImages();
      setStats(prev => ({ ...prev, totalGallery: prev.totalGallery - selectedIds.length }));
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Failed to delete images');
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleFeatured = async (image) => {
    try {
      await axios.patch(
        `https://trial.iphrdafrica.org/api/admin/gallery/${image.id}`,
        { isFeatured: !image.isFeatured },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      toast.success(image.isFeatured ? 'Removed from featured' : 'Set as featured');
      fetchGalleryImages();
    } catch (error) {
      console.error('Toggle featured error:', error);
      toast.error('Failed to update featured status');
    }
  };

  const filteredGalleryImages = galleryImages.filter(image => {
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          image.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          image.tags?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ==================== RENDER ENGAGEMENTS CONTENT ====================
  const renderEngagementsContent = () => {
    const filteredEngagements = selectedLevel === 'all' 
      ? engagements 
      : engagements.filter(e => e.level === selectedLevel);

    return (
      <>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Globe className="w-7 h-7 text-blue-500" />
              Engagement Management
            </h2>
            <p className="text-gray-500 text-sm mt-1">Manage engagements by level: Global, Regional, National, Community</p>
          </div>
          <button
            onClick={() => {
              resetEngagementForm();
              setShowEngagementModal(true);
            }}
            className="px-4 py-2 bg-iphrd-green text-white rounded-xl hover:bg-iphrd-green/90 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Engagement
          </button>
        </div>

        {/* Level Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedLevel('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              selectedLevel === 'all'
                ? 'bg-iphrd-green text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({engagements.length})
          </button>
          <button
            onClick={() => setSelectedLevel('global')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
              selectedLevel === 'global'
                ? 'bg-blue-500 text-white'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            <Globe className="w-4 h-4" />
            Global ({engagements.filter(e => e.level === 'global').length})
          </button>
          <button
            onClick={() => setSelectedLevel('regional')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
              selectedLevel === 'regional'
                ? 'bg-green-500 text-white'
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Regional ({engagements.filter(e => e.level === 'regional').length})
          </button>
          <button
            onClick={() => setSelectedLevel('national')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
              selectedLevel === 'national'
                ? 'bg-purple-500 text-white'
                : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            National ({engagements.filter(e => e.level === 'national').length})
          </button>
          <button
            onClick={() => setSelectedLevel('community')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
              selectedLevel === 'community'
                ? 'bg-orange-500 text-white'
                : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
            }`}
          >
            <Home className="w-4 h-4" />
            Community ({engagements.filter(e => e.level === 'community').length})
          </button>
        </div>

        {engagementsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iphrd-green mx-auto mb-4"></div>
              <p className="text-gray-500">Loading engagements...</p>
            </div>
          </div>
        ) : filteredEngagements.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <Globe className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600">No engagements found</h3>
            <p className="text-gray-400 mt-1">
              {selectedLevel !== 'all' ? `No engagements for ${selectedLevel} level` : 'Create your first engagement'}
            </p>
            <button
              onClick={() => {
                resetEngagementForm();
                setShowEngagementModal(true);
              }}
              className="mt-4 px-6 py-2 bg-iphrd-green text-white rounded-xl hover:bg-iphrd-green/90 transition"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add Engagement
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEngagements.map((engagement) => (
              <div key={engagement.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="relative h-48 bg-gray-100">
                  {engagement.image_url ? (
                    <img src={engagement.image_url} alt={engagement.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                      {getEngagementLevelIcon(engagement.level)}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={() => openEditEngagement(engagement)} className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition shadow-sm">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => {
                        setDeletingEngagement(engagement);
                        setShowEngagementDeleteModal(true);
                      }}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition shadow-sm"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 flex gap-2">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getEngagementLevelColor(engagement.level)}`}>
                      {engagement.level.charAt(0).toUpperCase() + engagement.level.slice(1)}
                    </span>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(engagement.status)}`}>
                      {engagement.status || 'upcoming'}
                    </span>
                  </div>
                  {engagement.youtube_link && (
                    <div className="absolute bottom-2 right-2">
                      <a href={engagement.youtube_link} target="_blank" rel="noopener noreferrer" className="p-2 bg-red-500/90 backdrop-blur-sm rounded-lg hover:bg-red-500 transition shadow-sm text-white">
                        <Youtube className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2">{engagement.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{engagement.description}</p>
                  <div className="flex flex-col gap-1.5 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>{new Date(engagement.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    {engagement.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{engagement.location}</span>
                      </div>
                    )}
                    {engagement.category && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                          {engagement.category}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Engagement Modal */}
        {showEngagementModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingEngagement ? 'Edit Engagement' : 'Add New Engagement'}
                </h2>
                <button onClick={() => { setShowEngagementModal(false); resetEngagementForm(); }} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleEngagementSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Engagement Title *</label>
                    <input 
                      type="text" 
                      value={engagementData.title} 
                      onChange={(e) => setEngagementData({...engagementData, title: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20" 
                      placeholder="e.g., Annual Conference 2024" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea 
                      value={engagementData.description} 
                      onChange={(e) => setEngagementData({...engagementData, description: e.target.value})} 
                      rows="3" 
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20" 
                      placeholder="Describe the engagement..." 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Engagement Level *</label>
                    <select 
                      value={engagementData.level} 
                      onChange={(e) => setEngagementData({...engagementData, level: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20"
                      required
                    >
                      <option value="global">🌍 Global</option>
                      <option value="regional">🌐 Regional</option>
                      <option value="national">🏛️ National</option>
                      <option value="community">🏘️ Community</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                    <input 
                      type="date" 
                      value={engagementData.event_date} 
                      onChange={(e) => setEngagementData({...engagementData, event_date: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input 
                      type="text" 
                      value={engagementData.location} 
                      onChange={(e) => setEngagementData({...engagementData, location: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20" 
                      placeholder="e.g., Nairobi, Kenya" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select 
                        value={engagementData.category} 
                        onChange={(e) => setEngagementData({...engagementData, category: e.target.value})} 
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20"
                      >
                        <option value="Conference">Conference</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Training">Training</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Webinar">Webinar</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select 
                        value={engagementData.status} 
                        onChange={(e) => setEngagementData({...engagementData, status: e.target.value})} 
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video Link</label>
                    <input 
                      type="url" 
                      value={engagementData.youtube_link} 
                      onChange={(e) => setEngagementData({...engagementData, youtube_link: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20" 
                      placeholder="https://www.youtube.com/watch?v=..." 
                    />
                    <p className="text-xs text-gray-400 mt-1">Paste the YouTube URL for the event video</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-iphrd-green transition cursor-pointer" onClick={() => document.getElementById('engagementImageInput').click()}>
                      {engagementData.imagePreview ? (
                        <div className="relative">
                          <img src={engagementData.imagePreview} alt="Engagement preview" className="max-h-48 mx-auto rounded-lg" />
                          <button type="button" onClick={(e) => { e.stopPropagation(); setEngagementData({...engagementData, imagePreview: null, image: null}); }} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-500">Click to upload event image</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG, WebP up to 5MB</p>
                        </>
                      )}
                      <input id="engagementImageInput" type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setEngagementData({ ...engagementData, image: file, imagePreview: URL.createObjectURL(file) }); } }} className="hidden" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button type="submit" disabled={engagementsLoading} className="flex-1 bg-iphrd-green text-white py-2.5 rounded-xl hover:bg-iphrd-green/90 transition disabled:opacity-50">
                    {engagementsLoading ? 'Saving...' : editingEngagement ? 'Update Engagement' : 'Create Engagement'}
                  </button>
                  <button type="button" onClick={() => { setShowEngagementModal(false); resetEngagementForm(); }} className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Engagement Delete Modal */}
        {showEngagementDeleteModal && deletingEngagement && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Delete Engagement?</h3>
                <p className="text-gray-500 mt-1">
                  Are you sure you want to delete "{deletingEngagement.title}"? This action cannot be undone.
                </p>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => handleDeleteEngagement(deletingEngagement.id)} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition">
                    Yes, Delete
                  </button>
                  <button onClick={() => { setShowEngagementDeleteModal(false); setDeletingEngagement(null); }} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // ==================== RENDER EVENTS CONTENT ====================
  const renderEventsContent = () => {
    return (
      <>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Calendar className="w-7 h-7 text-orange-500" />
              Our Events
            </h2>
            <p className="text-gray-500 text-sm mt-1">Manage and upload events for the user side</p>
          </div>
          <button
            onClick={() => {
              resetEventForm();
              setShowEventModal(true);
            }}
            className="px-4 py-2 bg-iphrd-green text-white rounded-xl hover:bg-iphrd-green/90 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Event
          </button>
        </div>

        {eventsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iphrd-green mx-auto mb-4"></div>
              <p className="text-gray-500">Loading events...</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600">No events yet</h3>
            <p className="text-gray-400 mt-1">Create your first event to display on the user side</p>
            <button
              onClick={() => {
                resetEventForm();
                setShowEventModal(true);
              }}
              className="mt-4 px-6 py-2 bg-iphrd-green text-white rounded-xl hover:bg-iphrd-green/90 transition"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="relative h-48 bg-gray-100">
                  {event.image_url ? (
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
                      <Calendar className="w-16 h-16 text-orange-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={() => openEditEvent(event)} className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition shadow-sm">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => {
                        setConfirmTitle('Delete Event');
                        setConfirmMessage(`Are you sure you want to delete "${event.title}"? This action cannot be undone.`);
                        setConfirmAction(() => () => handleDeleteEvent(event.id));
                        setShowConfirmModal(true);
                      }}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition shadow-sm"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      event.status === 'upcoming' ? 'bg-green-500 text-white' :
                      event.status === 'ongoing' ? 'bg-blue-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {event.status || 'upcoming'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2">{event.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{event.description}</p>
                  <div className="flex flex-col gap-1.5 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.category && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full capitalize">
                          {event.category}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showEventModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
                <button onClick={() => { setShowEventModal(false); resetEventForm(); }} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleEventSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                    <input type="text" value={eventData.title} onChange={(e) => setEventData({...eventData, title: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20" placeholder="e.g., Annual Conference 2024" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={eventData.description} onChange={(e) => setEventData({...eventData, description: e.target.value})} rows="3" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20" placeholder="Describe the event..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input type="date" value={eventData.date} onChange={(e) => setEventData({...eventData, date: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" value={eventData.location} onChange={(e) => setEventData({...eventData, location: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20" placeholder="e.g., Nairobi, Kenya" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={eventData.category} onChange={(e) => setEventData({...eventData, category: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20">
                      <option value="workshop">Workshop</option>
                      <option value="conference">Conference</option>
                      <option value="training">Training</option>
                      <option value="seminar">Seminar</option>
                      <option value="webinar">Webinar</option>
                      <option value="networking">Networking</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select value={eventData.status} onChange={(e) => setEventData({...eventData, status: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20">
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-iphrd-green transition cursor-pointer" onClick={() => document.getElementById('eventImageInput').click()}>
                      {eventData.imagePreview ? (
                        <div className="relative">
                          <img src={eventData.imagePreview} alt="Event preview" className="max-h-48 mx-auto rounded-lg" />
                          <button type="button" onClick={(e) => { e.stopPropagation(); setEventData({...eventData, imagePreview: null, image: null}); }} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-500">Click to upload event image</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG, WebP up to 5MB</p>
                        </>
                      )}
                      <input id="eventImageInput" type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setEventData({ ...eventData, image: file, imagePreview: URL.createObjectURL(file) }); } }} className="hidden" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button type="submit" disabled={eventsLoading} className="flex-1 bg-iphrd-green text-white py-2.5 rounded-xl hover:bg-iphrd-green/90 transition disabled:opacity-50">
                    {eventsLoading ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                  <button type="button" onClick={() => { setShowEventModal(false); resetEventForm(); }} className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  };

  // ==================== RENDER GALLERY CONTENT ====================
  const renderGalleryContent = () => {
    if (galleryLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iphrd-green mx-auto mb-4"></div>
            <p className="text-gray-500">Loading gallery...</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Image className="w-7 h-7 text-indigo-500" />
              Gallery Management
            </h2>
            <p className="text-gray-500 text-sm mt-1">Manage event photos and gallery images</p>
          </div>
          <div className="flex gap-3">
            {bulkDeleteMode ? (
              <>
                <button onClick={() => { setBulkDeleteMode(false); setSelectedIds([]); }} className="px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button onClick={handleBulkDelete} disabled={selectedIds.length === 0} className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedIds.length})
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setBulkDeleteMode(true)} className="px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Bulk Delete
                </button>
                <button onClick={() => setShowUploadModal(true)} className="px-4 py-2 bg-iphrd-green text-white rounded-xl hover:bg-iphrd-green/90 transition flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Images
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search gallery..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20 focus:border-iphrd-green" />
            </div>
            <div className="flex gap-3">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20 focus:border-iphrd-green bg-white">
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-2.5 px-4 transition ${viewMode === 'grid' ? 'bg-iphrd-green text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                  <Grid className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2.5 px-4 transition ${viewMode === 'list' ? 'bg-iphrd-green text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {filteredGalleryImages.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <Image className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600">No images found</h3>
            <p className="text-gray-400 mt-1">
              {searchTerm || selectedCategory !== 'all' ? 'Try adjusting your filters' : 'Upload your first gallery image'}
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <button onClick={() => setShowUploadModal(true)} className="mt-4 px-6 py-2 bg-iphrd-green text-white rounded-xl hover:bg-iphrd-green/90 transition">
                <Upload className="w-4 h-4 inline mr-2" />
                Upload Images
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredGalleryImages.map((image) => (
              <div key={image.id} className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                {bulkDeleteMode && (
                  <div className="absolute top-2 left-2 z-10">
                    <input type="checkbox" checked={selectedIds.includes(image.id)} onChange={() => toggleSelection(image.id)} className="w-5 h-5 rounded border-gray-300 text-iphrd-green focus:ring-iphrd-green" />
                  </div>
                )}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img src={image.image_url} alt={image.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  {image.is_featured && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      ★ Featured
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button onClick={() => handleEdit(image)} className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition text-white">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => toggleFeatured(image)} className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition text-white">
                      {image.is_featured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                    </button>
                    <button onClick={() => { setDeletingImage(image); setShowDeleteModal(true); }} className="p-2 bg-red-500/80 backdrop-blur-sm rounded-lg hover:bg-red-500 transition text-white">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800 truncate">{image.title}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-400 capitalize">{image.category || 'uncategorized'}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(image.date_uploaded).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {bulkDeleteMode && (
                    <th className="px-4 py-3 text-left">
                      <input type="checkbox" checked={selectedIds.length === filteredGalleryImages.length} onChange={() => { if (selectedIds.length === filteredGalleryImages.length) { setSelectedIds([]); } else { setSelectedIds(filteredGalleryImages.map(img => img.id)); } }} className="w-4 h-4 rounded border-gray-300 text-iphrd-green focus:ring-iphrd-green" />
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Uploaded</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Featured</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredGalleryImages.map((image) => (
                  <tr key={image.id} className="hover:bg-gray-50 transition">
                    {bulkDeleteMode && (
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selectedIds.includes(image.id)} onChange={() => toggleSelection(image.id)} className="w-4 h-4 rounded border-gray-300 text-iphrd-green focus:ring-iphrd-green" />
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <img src={image.image_url} alt={image.title} className="w-12 h-12 object-cover rounded-lg" />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-800">{image.title}</p>
                      {image.description && (
                        <p className="text-xs text-gray-400 truncate max-w-xs">{image.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
                        {image.category || 'uncategorized'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(image.date_uploaded).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {image.is_featured ? (
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ) : (
                        <StarOff className="w-4 h-4 text-gray-300" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(image)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => toggleFeatured(image)} className="p-1.5 hover:bg-yellow-50 rounded-lg text-yellow-500 transition">
                          {image.is_featured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                        </button>
                        <button onClick={() => { setDeletingImage(image); setShowDeleteModal(true); }} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-gray-800">Upload Gallery Images</h2>
                <button onClick={() => { setShowUploadModal(false); resetUploadForm(); }} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleUpload} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event/Album Title *</label>
                    <input type="text" value={uploadData.title} onChange={(e) => setUploadData({...uploadData, title: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20" placeholder="e.g., Annual Conference 2024" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={uploadData.category} onChange={(e) => setUploadData({...uploadData, category: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20">
                      <option value="event">Event</option>
                      <option value="workshop">Workshop</option>
                      <option value="conference">Conference</option>
                      <option value="training">Training</option>
                      <option value="community">Community</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                    <input type="text" value={uploadData.tags} onChange={(e) => setUploadData({...uploadData, tags: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20" placeholder="e.g., conference, keynote, 2024" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Images *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-iphrd-green transition cursor-pointer" onClick={() => document.getElementById('fileInput').click()}>
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">Click to select images</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG, WebP, GIF up to 10MB each</p>
                      <input id="fileInput" type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                    </div>
                    {selectedFiles.length > 0 && (
                      <p className="text-sm text-iphrd-green mt-2">{selectedFiles.length} images selected</p>
                    )}
                  </div>
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                          <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button type="submit" disabled={uploading || selectedFiles.length === 0} className="flex-1 bg-iphrd-green text-white py-2.5 rounded-xl hover:bg-iphrd-green/90 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Images`}
                  </button>
                  <button type="button" onClick={() => { setShowUploadModal(false); resetUploadForm(); }} className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && editingImage && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Edit Image Details</h2>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="p-6">
                <div className="space-y-4">
                  <div>
                    <img src={editingImage.image_url} alt={editingImage.title} className="w-full h-48 object-cover rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input type="text" value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} rows="3" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={editData.category} onChange={(e) => setEditData({...editData, category: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20">
                      <option value="event">Event</option>
                      <option value="workshop">Workshop</option>
                      <option value="conference">Conference</option>
                      <option value="training">Training</option>
                      <option value="community">Community</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                    <input type="text" value={editData.tags} onChange={(e) => setEditData({...editData, tags: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20" />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={editData.isFeatured} onChange={(e) => setEditData({...editData, isFeatured: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-iphrd-green focus:ring-iphrd-green" />
                    <label className="text-sm font-medium text-gray-700">Set as Featured Image</label>
                  </div>
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button type="submit" className="flex-1 bg-iphrd-green text-white py-2.5 rounded-xl hover:bg-iphrd-green/90 transition">
                    Save Changes
                  </button>
                  <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteModal && deletingImage && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Delete Image?</h3>
                <p className="text-gray-500 mt-1">
                  Are you sure you want to delete "{deletingImage.title}"? This action cannot be undone.
                </p>
                <div className="flex gap-3 mt-6">
                  <button onClick={handleDelete} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition">
                    Yes, Delete
                  </button>
                  <button onClick={() => { setShowDeleteModal(false); setDeletingImage(null); }} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">{confirmTitle || 'Confirm Action'}</h3>
                <p className="text-gray-500 mt-1">
                  {confirmMessage || 'Are you sure you want to proceed?'}
                </p>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => { setShowConfirmModal(false); setConfirmAction(null); }} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button onClick={() => { if (confirmAction) { confirmAction(); } setShowConfirmModal(false); setConfirmAction(null); }} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition">
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iphrd-green mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="p-6 lg:p-8">
        {activeTab === 'gallery' ? (
          renderGalleryContent()
        ) : activeTab === 'events' ? (
          renderEventsContent()
        ) : activeTab === 'engagements' ? (
          renderEngagementsContent()
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.username}</h1>
              <p className="text-gray-500 mt-1">Here's what's happening with your content today</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-5 mb-8">
              <Link to="/admin/news" className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group block">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Newspaper className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalNews}</p>
                <p className="text-xs text-gray-500">News Articles</p>
              </Link>
              <Link to="/admin/blog" className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group block">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalBlog}</p>
                <p className="text-xs text-gray-500">Blog Posts</p>
              </Link>
              <Link to="/admin/events" className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group block">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Calendar className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalEvents}</p>
                <p className="text-xs text-gray-500">Our Events</p>
              </Link>
              <Link to="/admin/engagements" className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group block">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Globe className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalEngagements}</p>
                <p className="text-xs text-gray-500">Engagements</p>
              </Link>
              <Link to="/admin/opportunities" className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group block">
                <div className="w-10 h-10 bg-iphrd-green/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Briefcase className="w-5 h-5 text-iphrd-green" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalOpportunities}</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">Opportunities</span>
                  <span className="text-xs text-iphrd-green font-medium">{stats.openOpportunities} open</span>
                </div>
              </Link>
              <Link to="/admin/applications" className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group block">
                <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Users className="w-5 h-5 text-pink-500" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalApplications}</p>
                {stats.pendingApplications > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Applications</span>
                    <span className="text-xs text-yellow-600 font-medium">{stats.pendingApplications} pending</span>
                  </div>
                )}
              </Link>
              <Link to="/admin/gallery" className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group block">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Image className="w-5 h-5 text-indigo-500" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalGallery}</p>
                <p className="text-xs text-gray-500">Gallery Images</p>
              </Link>
            </div>

            {/* Engagement Levels Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-xs text-blue-600 font-medium">GLOBAL</p>
                    <p className="text-xl font-bold text-blue-700">{stats.globalEngagements}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="text-xs text-green-600 font-medium">REGIONAL</p>
                    <p className="text-xl font-bold text-green-700">{stats.regionalEngagements}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
                <div className="flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-purple-500" />
                  <div>
                    <p className="text-xs text-purple-600 font-medium">NATIONAL</p>
                    <p className="text-xl font-bold text-purple-700">{stats.nationalEngagements}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200">
                <div className="flex items-center gap-3">
                  <Home className="w-6 h-6 text-orange-500" />
                  <div>
                    <p className="text-xs text-orange-600 font-medium">COMMUNITY</p>
                    <p className="text-xl font-bold text-orange-700">{stats.communityEngagements}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-iphrd-green/5 to-iphrd-blue/5 rounded-2xl p-6 mb-8 border border-iphrd-green/10">
              <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-iphrd-green" />
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-3">
                <Link to="/admin/news" className="group px-5 py-2.5 bg-iphrd-green text-white text-sm rounded-xl hover:bg-iphrd-green/90 transition-all shadow-sm hover:shadow-md flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Add News Article</span>
                </Link>
                <Link to="/admin/blog" className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm rounded-xl hover:border-iphrd-green hover:text-iphrd-green transition-all hover:shadow-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Blog Post
                </Link>
                <Link to="/admin/events" className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm rounded-xl hover:border-iphrd-green hover:text-iphrd-green transition-all hover:shadow-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Event
                </Link>
                <Link to="/admin/engagements" className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm rounded-xl hover:border-iphrd-green hover:text-iphrd-green transition-all hover:shadow-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Engagement
                </Link>
                <Link to="/admin/opportunities" className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm rounded-xl hover:border-iphrd-green hover:text-iphrd-green transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Opportunity
                </Link>
                <Link to="/admin/gallery" className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm rounded-xl hover:border-iphrd-green hover:text-iphrd-green transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Upload to Gallery
                </Link>
                <Link to="/admin/applications" className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm rounded-xl hover:border-iphrd-green hover:text-iphrd-green transition-all flex items-center gap-1">
                  View Applications
                  <Eye className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-iphrd-green" />
                    Recent Opportunities
                  </h2>
                  <Link to="/admin/opportunities" className="text-xs text-iphrd-green hover:underline flex items-center gap-1">
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentOpportunities.length > 0 ? (
                    recentOpportunities.map((opp) => (
                      <div key={opp.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{opp.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">{opp.type}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span className="text-xs text-gray-400">{opp.location}</span>
                          </div>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${opp.status === 'Open' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                          {opp.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-12 text-center text-gray-400 text-sm">
                      No opportunities yet
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="w-4 h-4 text-iphrd-green" />
                    Recent Applications
                  </h2>
                  <Link to="/admin/applications" className="text-xs text-iphrd-green hover:underline flex items-center gap-1">
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentApplications.length > 0 ? (
                    recentApplications.map((app) => (
                      <div key={app.id} className="px-6 py-4 hover:bg-gray-50 transition">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{app.full_name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{app.opportunity_title}</p>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            app.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                            app.status === 'reviewed' ? 'bg-blue-50 text-blue-600' : 
                            app.status === 'shortlisted' ? 'bg-purple-50 text-purple-600' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(app.date_applied).toLocaleDateString()}
                          </p>
                          <a href={app.cv_url} target="_blank" rel="noopener noreferrer" className="text-xs text-iphrd-green hover:underline flex items-center gap-1">
                            View CV <ArrowRight className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-12 text-center text-gray-400 text-sm">
                      No applications yet
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                    <Image className="w-4 h-4 text-indigo-500" />
                    Recent Gallery Uploads
                  </h2>
                  <Link to="/admin/gallery" className="text-xs text-iphrd-green hover:underline flex items-center gap-1">
                    Manage <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="p-4">
                  {recentGalleryImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {recentGalleryImages.map((image) => (
                        <div key={image.id} className="group relative">
                          <img src={image.image_url} alt={image.title} className="w-full h-32 object-cover rounded-lg shadow-sm group-hover:shadow-md transition" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-medium">{image.title}</span>
                          </div>
                          <div className="mt-1">
                            <p className="text-xs font-medium text-gray-700 truncate">{image.title}</p>
                            <p className="text-xs text-gray-400 capitalize">{image.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      No images uploaded yet
                      <Link to="/admin/gallery" className="block mt-2 text-iphrd-green hover:underline">
                        Upload your first image →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;