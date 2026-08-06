import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Globe,
  MapPin,
  Building2,
  Home,
  Plus,
  Edit,
  Trash2,
  X,
  Upload,
  Calendar,
  Youtube,
  Search,
  FileText
} from 'lucide-react';

function EngagementManagement() {
  const [engagements, setEngagements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEngagement, setEditingEngagement] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingEngagement, setDeletingEngagement] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    global: 0,
    regional: 0,
    national: 0,
    community: 0
  });

  const [engagementData, setEngagementData] = useState({
    name: '',
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

  const BACKEND_URL = 'https://trial.iphrdafrica.org';

  // Create axios instance with credentials
  const api = axios.create({
    baseURL: `${BACKEND_URL}/api`,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Handle 401 responses - redirect to login
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  const fetchEngagements = async () => {
    setLoading(true);
    try {
      const response = await api.get('/engagements');
      setEngagements(response.data);
      
      const globalCount = response.data.filter(e => e.level === 'global').length;
      const regionalCount = response.data.filter(e => e.level === 'regional').length;
      const nationalCount = response.data.filter(e => e.level === 'national').length;
      const communityCount = response.data.filter(e => e.level === 'community').length;
      
      setStats({
        total: response.data.length,
        global: globalCount,
        regional: regionalCount,
        national: nationalCount,
        community: communityCount
      });
    } catch (error) {
      console.error('Error fetching engagements:', error);
      toast.error('Failed to load engagements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngagements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', engagementData.name);
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
        ? `/admin/engagements/${editingEngagement.id}`
        : '/admin/engagements';
      const method = editingEngagement ? 'put' : 'post';

      await api({
        method: method,
        url: url,
        data: formData,
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      toast.success(editingEngagement ? 'Engagement updated successfully' : 'Engagement created successfully');
      setShowModal(false);
      resetForm();
      await fetchEngagements();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.error || 'Failed to save engagement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (engagementId) => {
    try {
      await api.delete(`/admin/engagements/${engagementId}`, { withCredentials: true });
      toast.success('Engagement deleted successfully');
      setShowDeleteModal(false);
      setDeletingEngagement(null);
      await fetchEngagements();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete engagement');
    }
  };

  const resetForm = () => {
    setEngagementData({
      name: '',
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

  const openEdit = (engagement) => {
    setEditingEngagement(engagement);
    setEngagementData({
      name: engagement.title || engagement.name || '',
      description: engagement.description || '',
      level: engagement.level || 'global',
      event_date: engagement.event_date || '',
      location: engagement.location || '',
      category: engagement.category || 'Conference',
      status: engagement.status || 'upcoming',
      youtube_link: engagement.youtube_link || '',
      image: null,
      imagePreview: engagement.image_url ? 
        (engagement.image_url.startsWith('http') ? engagement.image_url : `${BACKEND_URL}${engagement.image_url}`) 
        : null
    });
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'ongoing': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getLevelBadgeColor = (level) => {
    switch(level) {
      case 'global': return 'bg-blue-100 text-blue-700';
      case 'regional': return 'bg-green-100 text-green-700';
      case 'national': return 'bg-purple-100 text-purple-700';
      case 'community': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Filter engagements
  const filteredEngagements = engagements.filter(engagement => {
    const matchesLevel = selectedLevel === 'all' || engagement.level === selectedLevel;
    const searchText = (engagement.title || engagement.name || '').toLowerCase();
    const matchesSearch = searchText.includes(searchTerm.toLowerCase()) ||
                          engagement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (engagement.location && engagement.location.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  // ✅ FIXED: Get image URL from the correct backend
  const getImageUrl = (engagement) => {
    if (!engagement) return null;
    
    // If image_url exists, use it directly
    if (engagement.image_url) {
      // If it starts with http, use as is, otherwise prepend backend URL
      if (engagement.image_url.startsWith('http')) {
        return engagement.image_url;
      }
      return `${BACKEND_URL}${engagement.image_url}`;
    }
    
    // If image field exists, construct the URL
    if (engagement.image) {
      return `${BACKEND_URL}/uploads/engagements/${engagement.image}`;
    }
    
    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
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
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-iphrd-green text-white rounded-xl hover:bg-iphrd-green/90 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Engagement
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-blue-600 font-medium">Global</p>
          </div>
          <p className="text-2xl font-bold text-blue-700">{stats.global}</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-500" />
            <p className="text-sm text-green-600 font-medium">Regional</p>
          </div>
          <p className="text-2xl font-bold text-green-700">{stats.regional}</p>
        </div>
        <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-500" />
            <p className="text-sm text-purple-600 font-medium">National</p>
          </div>
          <p className="text-2xl font-bold text-purple-700">{stats.national}</p>
        </div>
        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-orange-500" />
            <p className="text-sm text-orange-600 font-medium">Community</p>
          </div>
          <p className="text-2xl font-bold text-orange-700">{stats.community}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search engagements by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20 focus:border-iphrd-green"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => setSelectedLevel('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                selectedLevel === 'all'
                  ? 'bg-iphrd-green text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Levels ({engagements.length})
            </button>
            <button
              onClick={() => setSelectedLevel('global')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
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
              className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
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
              className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
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
              className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
                selectedLevel === 'community'
                  ? 'bg-orange-500 text-white'
                  : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
              }`}
            >
              <Home className="w-4 h-4" />
              Community ({engagements.filter(e => e.level === 'community').length})
            </button>
          </div>
        </div>
      </div>

      {/* Engagements Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iphrd-green mx-auto mb-4"></div>
            <p className="text-gray-500">Loading engagements...</p>
          </div>
        </div>
      ) : filteredEngagements.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
          <Globe className="w-20 h-20 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-600">No engagements found</h3>
          <p className="text-gray-400 mt-1">
            {searchTerm || selectedLevel !== 'all' 
              ? 'Try adjusting your search or filter' 
              : 'Create your first engagement to get started'}
          </p>
          {!searchTerm && selectedLevel === 'all' && (
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="mt-4 px-6 py-2.5 bg-iphrd-green text-white rounded-xl hover:bg-iphrd-green/90 transition inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Engagement
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEngagements.map((engagement) => {
                  const imageSrc = getImageUrl(engagement);
                  
                  return (
                    <tr key={engagement.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        {imageSrc ? (
                          <img 
                            src={imageSrc} 
                            alt={engagement.title || engagement.name} 
                            className="w-12 h-12 object-cover rounded-lg"
                            onError={(e) => {
                              // Try alternative path if first fails
                              if (!e.target.dataset.retried && engagement.image) {
                                e.target.dataset.retried = 'true';
                                e.target.src = `${BACKEND_URL}/static/uploads/engagements/${engagement.image}`;
                              } else {
                                // Show fallback
                                e.target.style.display = 'none';
                                const parent = e.target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                  `;
                                }
                              }
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-800 line-clamp-2 max-w-xs">
                            {engagement.title || engagement.name || 'Untitled Engagement'}
                          </p>
                          {engagement.description && (
                            <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">
                              {engagement.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getLevelBadgeColor(engagement.level)}`}>
                          {engagement.level.charAt(0).toUpperCase() + engagement.level.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(engagement.event_date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {engagement.location || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(engagement.status)}`}>
                          {engagement.status || 'upcoming'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {engagement.youtube_link && (
                            <a
                              href={engagement.youtube_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition"
                            >
                              <Youtube className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => openEdit(engagement)}
                            className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingEngagement(engagement);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {editingEngagement ? 'Edit Engagement' : 'Add New Engagement'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Engagement Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      value={engagementData.name} 
                      onChange={(e) => setEngagementData({...engagementData, name: e.target.value})} 
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20" 
                      placeholder="e.g., Regional Peace Dialogue Conference" 
                      required 
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Give your engagement a meaningful name</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    value={engagementData.description} 
                    onChange={(e) => setEngagementData({...engagementData, description: e.target.value})} 
                    rows="3" 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20" 
                    placeholder="Describe the engagement activities, objectives, and outcomes..." 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Engagement Level <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={engagementData.level} 
                    onChange={(e) => setEngagementData({...engagementData, level: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-iphrd-green/20"
                    required
                  >
                    <option value="global">🌍 Global - International level</option>
                    <option value="regional">🌐 Regional - Multi-country</option>
                    <option value="national">🏛️ National - Country level</option>
                    <option value="community">🏘️ Community - Local level</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date <span className="text-red-500">*</span>
                  </label>
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
                      <option value="Dialogue">Dialogue</option>
                      <option value="Consultation">Consultation</option>
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
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-iphrd-green transition cursor-pointer"
                    onClick={() => document.getElementById('engagementImageInput').click()}
                  >
                    {engagementData.imagePreview ? (
                      <div className="relative inline-block">
                        <img src={engagementData.imagePreview} alt="Engagement preview" className="max-h-48 rounded-lg" />
                        <button 
                          type="button" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setEngagementData({...engagementData, imagePreview: null, image: null}); 
                          }} 
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
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
                    <input 
                      id="engagementImageInput" 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => { 
                        const file = e.target.files[0]; 
                        if (file) { 
                          setEngagementData({ 
                            ...engagementData, 
                            image: file, 
                            imagePreview: URL.createObjectURL(file) 
                          }); 
                        } 
                      }} 
                      className="hidden" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button type="submit" disabled={loading} className="flex-1 bg-iphrd-green text-white py-2.5 rounded-xl hover:bg-iphrd-green/90 transition disabled:opacity-50">
                  {loading ? 'Saving...' : editingEngagement ? 'Update Engagement' : 'Create Engagement'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && deletingEngagement && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Delete Engagement?</h3>
              <p className="text-gray-500 mt-1">
                Are you sure you want to delete "<span className="font-medium">{deletingEngagement.title || deletingEngagement.name}</span>"? This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => handleDelete(deletingEngagement.id)} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition">
                  Yes, Delete
                </button>
                <button onClick={() => { setShowDeleteModal(false); setDeletingEngagement(null); }} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EngagementManagement;