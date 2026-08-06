// src/pages/Admin/AdminBlog.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Plus, Edit, Trash2, 
  LayoutDashboard, Newspaper, BookOpen,
  Briefcase, Users, Settings, LogOut,
  Menu, Bell, UserCircle,  Search,
  FileText, Calendar,  Image
} from 'lucide-react';

function AdminBlog() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    featured_image: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

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
      fetchBlogPosts();
    }
  }, [user]);

  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://trial.iphrdafrica.org/api/blog');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to load blog posts');
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
      setFormData({ ...formData, featured_image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const openCreateForm = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', tags: '', featured_image: null });
    setPreviewUrl(null);
    setShowForm(true);
  };

  const openEditForm = (post) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      content: post.content,
      tags: post.tags ? post.tags.join(',') : '',
      featured_image: null
    });
    if (post.featured_image) setPreviewUrl(post.featured_image);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('tags', formData.tags);
      if (formData.featured_image) {
        formDataToSend.append('file', formData.featured_image);
      }
      
      const url = editingId 
        ? `https://trial.iphrdafrica.org/api/admin/blog/${editingId}`
        : 'https://trial.iphrdafrica.org/api/admin/blog';
      
      const method = editingId ? 'patch' : 'post';
      
      const response = await axios[method](url, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      
      if (response.data.success) {
        toast.success(editingId ? 'Blog post updated!' : 'Blog post created!');
        setShowForm(false);
        fetchBlogPosts();
      } else {
        throw new Error(response.data?.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Failed to save blog post');
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
  
  const toastId = toast.loading('Deleting blog post...');
  
  try {
    const response = await axios.delete(
      `https://trial.iphrdafrica.org/api/admin/blog/${deleteId}`, 
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (response.status === 200 && response.data.success) {
      toast.update(toastId, {
        render: response.data.message || 'Blog post deleted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
      fetchBlogPosts();
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  } catch (error) {
    console.error('Delete error:', error);
    toast.update(toastId, {
      render: error.response?.data?.error || 'Failed to delete blog post',
      type: 'error',
      isLoading: false,
      autoClose: 3000
    });
  }
};

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    toast.success('Logged out');
    navigate('/login');
  };

  const getFullUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `https://trial.iphrdafrica.org${url}`;
  };

  const menuItems = [
     { name: 'Overview', icon: LayoutDashboard, path: '/admin', exact: true, color: 'text-iphrd-green' },
     { name: 'News', icon: Newspaper, path: '/admin/news', color: 'text-blue-500' },
     { name: 'Blog', icon: BookOpen, path: '/admin/blog', color: 'text-purple-500' },
     { name: 'Our Events', icon: Calendar, path: '/admin/events', color: 'text-orange-500' },
     { name: 'Gallery', icon: Image, path: '/admin/gallery', color: 'text-indigo-500' },
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

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      
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
              <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
              <p className="text-gray-500">Manage blog posts and articles (images are optional)</p>
            </div>
            <button onClick={openCreateForm} className="px-4 py-2 bg-iphrd-green text-white rounded-lg hover:bg-iphrd-green/90 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Blog Post
            </button>
          </div>

          <div className="bg-white rounded-lg border p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search blog posts..." 
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
                  <h2 className="text-lg font-semibold">{editingId ? 'Edit Blog Post' : 'Add Blog Post'}</h2>
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
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Content *</label>
                    <textarea 
                      name="content" 
                      rows="10" 
                      required 
                      value={formData.content} 
                      onChange={handleInputChange} 
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-iphrd-green" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      name="tags" 
                      value={formData.tags} 
                      onChange={handleInputChange} 
                      placeholder="peace, human rights, development" 
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-iphrd-green" 
                    />
                    <p className="text-xs text-gray-500 mt-1">Example: peace, human rights, africa</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Featured Image (Optional)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="w-full border rounded-lg px-4 py-2" 
                    />
                    {previewUrl && (
                      <div className="mt-2">
                        <img src={previewUrl} alt="Preview" className="h-32 rounded-lg object-cover" />
                        <p className="text-xs text-gray-500 mt-1">Preview of uploaded image</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Accepted formats: JPG, PNG, GIF. Image is optional.</p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button 
                      type="submit" 
                      disabled={submitting} 
                      className="flex-1 bg-iphrd-green text-white px-4 py-2 rounded-lg hover:bg-iphrd-green/90 disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : (editingId ? 'Save Changes' : 'Create Blog Post')}
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
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No blog posts found</p>
              </div>
            ) : (
              filteredPosts.map(post => (
                <div key={post.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date_posted).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 text-lg mb-1">{post.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {post.content?.substring(0, 150)}...
                      </p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {post.featured_image && (
                        <div className="mt-2">
                          <img 
                            src={getFullUrl(post.featured_image)} 
                            alt={post.title} 
                            className="h-16 w-auto rounded object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditForm(post)} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => confirmDelete(post.id)} 
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
            <h3 className="text-lg font-bold mb-2">Delete Blog Post</h3>
            <p className="text-gray-600 mb-4">Are you sure? This action cannot be undone.</p>
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

export default AdminBlog;