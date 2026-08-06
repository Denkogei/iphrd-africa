// src/pages/Admin/AdminPress.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Plus, Edit, Trash2, X,
  LayoutDashboard, Newspaper, BookOpen, Megaphone,
  FileBarChart, Briefcase, Users, Settings, LogOut,
  Menu, Bell, UserCircle, RefreshCw, Search,
  FileText, Calendar, File, Download, Eye
} from 'lucide-react';

function AdminPress() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    document: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

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
      fetchPressReleases();
    }
  }, [user]);

  const fetchPressReleases = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://trial.iphrdafrica.org/api/press-releases');
      setReleases(response.data);
    } catch (error) {
      console.error('Error fetching press releases:', error);
      toast.error('Failed to load press releases');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, document: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const openCreateForm = () => {
    setEditingId(null);
    setFormData({ title: '', document: null });
    setPreviewUrl(null);
    setShowForm(true);
  };

  const openEditForm = (release) => {
    setEditingId(release.id);
    setFormData({
      title: release.title,
      document: null
    });
    if (release.document_url) setPreviewUrl(release.document_url);
    setShowForm(true);
  };

  const viewDocument = (url) => {
    setSelectedDocument(url);
    setShowPdfModal(true);
  };

  const getFullUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `https://trial.iphrdafrica.org${url}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', 'Press release document'); // Add default content
      if (formData.document) {
        formDataToSend.append('file', formData.document);
      }
      
      const url = editingId 
        ? `https://trial.iphrdafrica.org/api/admin/press-releases/${editingId}`
        : 'https://trial.iphrdafrica.org/api/admin/press-releases';
      
      const method = editingId ? 'patch' : 'post';
      
      const response = await axios[method](url, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      
      if (response.data.success) {
        toast.success(editingId ? 'Press release updated!' : 'Press release created!');
        setShowForm(false);
        fetchPressReleases();
      } else {
        throw new Error(response.data?.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Failed to save press release');
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
      const response = await axios.delete(`https://trial.iphrdafrica.org/api/admin/press-releases/${deleteId}`, { 
        withCredentials: true 
      });
      if (response.data.success) {
        toast.success('Press release deleted!');
        fetchPressReleases();
        setShowDeleteModal(false);
        setDeleteId(null);
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.error || 'Failed to delete');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    toast.success('Logged out');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/admin', exact: true, color: 'text-iphrd-green' },
    { name: 'News', icon: Newspaper, path: '/admin/news', color: 'text-blue-500' },
    { name: 'Blog', icon: BookOpen, path: '/admin/blog', color: 'text-purple-500' },
    { name: 'Press Releases', icon: Megaphone, path: '/admin/press', color: 'text-orange-500' },
    { name: 'Reports', icon: FileBarChart, path: '/admin/reports', color: 'text-green-500' },
    { name: 'Opportunities', icon: Briefcase, path: '/admin/opportunities', color: 'text-iphrd-green' },
    { name: 'Applications', icon: Users, path: '/admin/applications', color: 'text-pink-500' },
    { name: 'Settings', icon: Settings, path: '/admin/settings', color: 'text-gray-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iphrd-green mx-auto"></div>
      </div>
    );
  }

  const filteredReleases = releases.filter(release =>
    release.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* PDF Preview Modal */}
      {showPdfModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Press Release Document</h2>
              <div className="flex gap-2">
                <a
                  href={selectedDocument}
                  download
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </a>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
              <iframe
                src={selectedDocument}
                className="w-full h-full min-h-[70vh] bg-white rounded-lg"
                title="Press Release Preview"
              />
            </div>
          </div>
        </div>
      )}

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

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

        <nav className="flex-1 py-6 px-4">
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
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all duration-200 group">
            <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform" />
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Press Releases</h1>
              <p className="text-gray-500">Manage press releases - title and PDF document</p>
            </div>
            <button onClick={openCreateForm} className="px-4 py-2 bg-iphrd-green text-white rounded-lg hover:bg-iphrd-green/90 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Press Release
            </button>
          </div>

          <div className="bg-white rounded-lg border p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search press releases by title..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-iphrd-green" 
              />
            </div>
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white">
                  <h2 className="text-lg font-semibold">{editingId ? 'Edit Press Release' : 'Add Press Release'}</h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <input 
                      type="text" 
                      name="title" 
                      required 
                      value={formData.title} 
                      onChange={handleInputChange} 
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-iphrd-green" 
                      placeholder="Enter press release title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">PDF Document *</label>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={handleFileChange} 
                      required={!editingId}
                      className="w-full border rounded-lg px-4 py-2" 
                    />
                    {previewUrl && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">File ready: {previewUrl.split('/').pop()}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Upload PDF document for people to view and download</p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button 
                      type="submit" 
                      disabled={submitting} 
                      className="flex-1 bg-iphrd-green text-white px-4 py-2 rounded-lg hover:bg-iphrd-green/90 disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : (editingId ? 'Save Changes' : 'Create Press Release')}
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

          <div className="space-y-3">
            {filteredReleases.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No press releases found</p>
              </div>
            ) : (
              filteredReleases.map(release => (
                <div key={release.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(release.date_posted).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 text-lg mb-2">{release.title}</h3>
                      {release.document_url && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => viewDocument(getFullUrl(release.document_url))}
                            className="text-sm text-iphrd-green hover:underline inline-flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" /> View PDF
                          </button>
                          <a
                            href={getFullUrl(release.document_url)}
                            download
                            className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                          >
                            <Download className="w-4 h-4" /> Download PDF
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditForm(release)} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => confirmDelete(release.id)} 
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-2">Delete Press Release</h3>
            <p className="text-gray-600 mb-4">Are you sure? This will also delete the PDF document.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPress;