// src/pages/Admin/AdminGalleryManager.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Icons
import {
  LayoutDashboard,
  Newspaper,
  BookOpen,
  Briefcase,
  Users,
  Settings,
  LogOut,
  Menu,
  Bell,
  UserCircle,
  Plus,
  Image,
  X,
  Upload,
  Trash2,
  Star,
  Grid,
  List,
  Calendar,
} from 'lucide-react';

// API Base URL
const API_BASE_URL = 'https://trial.iphrdafrica.org';

const AdminGalleryManager = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'global',
    tags: '',
    is_featured: false
  });

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingImage, setDeletingImage] = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);

  const categories = ['global', 'regional', 'local', 'events', 'workshops', 'conferences'];
  const fileInputRef = useRef(null);

  // Auth check
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch images
  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/gallery`);
      console.log('Images data:', response.data);
      console.log('Image URLs:', response.data.map(img => img.image_url));
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load gallery images');
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle multiple file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Upload multiple images
  const handleMultipleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.warning('Please select at least one image');
      return;
    }

    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        failCount++;
        continue;
      }

      const imageTitle = formData.title || file.name.replace(/\.[^/.]+$/, '');
      
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('title', imageTitle);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('category', formData.category);
      uploadFormData.append('tags', formData.tags);
      uploadFormData.append('is_featured', formData.is_featured && i === 0 ? 'true' : 'false');

      setUploadProgress(prev => ({ ...prev, [file.name]: 'uploading' }));

      try {
        await axios.post(`${API_BASE_URL}/api/admin/gallery`, uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({ ...prev, [file.name]: percentCompleted }));
          }
        });
        successCount++;
        setUploadProgress(prev => ({ ...prev, [file.name]: 'complete' }));
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        failCount++;
        setUploadProgress(prev => ({ ...prev, [file.name]: 'error' }));
      }
    }

    setUploading(false);
    setSelectedFiles([]);
    
    if (successCount > 0) {
      toast.success(`✅ Successfully uploaded ${successCount} image${successCount > 1 ? 's' : ''}`);
      fetchImages();
      setFormData({
        title: '',
        description: '',
        category: 'global',
        tags: '',
        is_featured: false
      });
    }
    
    if (failCount > 0) {
      toast.error(`❌ Failed to upload ${failCount} image${failCount > 1 ? 's' : ''}`);
    }
  };

  // Show delete confirmation modal
  const confirmDelete = (image) => {
    setDeletingImage(image);
    setShowDeleteModal(true);
  };

  // Handle single delete
  const handleDelete = async () => {
    if (!deletingImage) return;
    
    const toastId = toast.loading(`Deleting "${deletingImage.title}"...`);
    
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/gallery/${deletingImage.id}`, {
        withCredentials: true
      });
      toast.update(toastId, {
        render: `✅ Image "${deletingImage.title}" deleted successfully!`,
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
      setShowDeleteModal(false);
      setDeletingImage(null);
      fetchImages();
    } catch (error) {
      console.error('Delete error:', error);
      toast.update(toastId, {
        render: `❌ Failed to delete "${deletingImage.title}"`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  // Show bulk delete confirmation
  const confirmBulkDelete = () => {
    const selectedImages = images.filter(img => img.selected);
    if (selectedImages.length === 0) {
      toast.warning('No images selected');
      return;
    }
    setBulkDeleteCount(selectedImages.length);
    setShowBulkDeleteModal(true);
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    const selectedImages = images.filter(img => img.selected);
    const toastId = toast.loading(`Deleting ${selectedImages.length} images...`);
    let deleted = 0;
    
    for (const img of selectedImages) {
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/gallery/${img.id}`, {
          withCredentials: true
        });
        deleted++;
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
    
    setShowBulkDeleteModal(false);
    
    if (deleted > 0) {
      toast.update(toastId, {
        render: `✅ Successfully deleted ${deleted} image${deleted > 1 ? 's' : ''}!`,
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
      fetchImages();
    } else {
      toast.update(toastId, {
        render: '❌ Failed to delete images',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  // Toggle featured status
  const handleToggleFeatured = async (imageId, currentStatus) => {
    const newStatus = !currentStatus;
    const toastId = toast.loading(`${newStatus ? 'Setting' : 'Removing'} featured status...`);
    
    try {
      await axios.patch(`${API_BASE_URL}/api/admin/gallery/${imageId}`, {
        is_featured: newStatus
      }, {
        withCredentials: true
      });
      
      toast.update(toastId, {
        render: newStatus ? '⭐ Image featured successfully!' : '⭐ Featured status removed',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
      
      fetchImages();
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast.update(toastId, {
        render: '❌ Failed to update featured status',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  // Toggle image selection for bulk operations
  const toggleImageSelection = (imageId) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, selected: !img.selected } : img
    ));
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const stats = {
    totalNews: 0,
    totalBlog: 0,
    totalPress: 0,
    totalReports: 0,
    totalOpportunities: 0,
    totalApplications: 0,
    totalGallery: images.length
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

  const selectedCount = images.filter(img => img.selected).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-30 w-80 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-6 border-b border-gray-100 bg-gradient-to-r from-iphrd-green to-iphrd-blue">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
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
              <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-iphrd-green"></span>
                {user?.role}
              </p>
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
              {item.count !== undefined && item.count > 0 && (
                <span className="text-xs text-gray-400">{item.count}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-100 bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-80 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden transition"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative transition">
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

        {/* Gallery Content */}
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Gallery Manager</h1>
              <p className="text-gray-500 mt-1">Manage your image gallery - upload, organize, and feature images</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-500" />
              Upload Images
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Image Title (for single upload or prefix for multiple)"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <textarea
                  placeholder="Description (applies to all uploaded images)"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Tags (comma-separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">Feature first image in gallery</span>
                </label>
              </div>

              <div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition">
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition inline-flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Select Images (Multiple)
                  </button>
                  <p className="text-sm text-gray-500 mt-3">
                    Supported formats: PNG, JPG, JPEG, GIF, WEBP<br />
                    No limit on number of images
                  </p>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Selected Files ({selectedFiles.length})
                    </h3>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div className="flex items-center gap-2">
                            <img src={URL.createObjectURL(file)} alt="preview" className="w-10 h-10 object-cover rounded" />
                            <div>
                              <p className="text-sm font-medium truncate w-48">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
                            </div>
                          </div>
                          {uploadProgress[file.name] && uploadProgress[file.name] !== 'complete' && uploadProgress[file.name] !== 'error' && (
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-indigo-600 transition-all"
                                  style={{ width: `${uploadProgress[file.name]}%` }}
                                />
                              </div>
                              <span className="text-xs">{uploadProgress[file.name]}%</span>
                            </div>
                          )}
                          {uploadProgress[file.name] === 'complete' && (
                            <span className="text-green-600 text-xs">✓ Uploaded</span>
                          )}
                          {uploadProgress[file.name] === 'error' && (
                            <span className="text-red-600 text-xs">✗ Failed</span>
                          )}
                          <button
                            onClick={() => removeSelectedFile(index)}
                            className="text-red-500 hover:text-red-700"
                            disabled={uploading}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleMultipleUpload}
                      disabled={uploading}
                      className="w-full mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload {selectedFiles.length} Image{selectedFiles.length > 1 ? 's' : ''}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedCount > 0 && (
            <div className="bg-indigo-50 rounded-xl p-4 mb-6 flex justify-between items-center">
              <span className="text-indigo-700 font-medium">{selectedCount} image(s) selected</span>
              <button
                onClick={confirmBulkDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </button>
            </div>
          )}

          {/* Images Display */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Gallery Images ({images.length})
              </h2>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
                {images.map(image => (
                  <div key={image.id} className="group relative bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={`${API_BASE_URL}${image.image_url}`} 
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <button
                          onClick={() => toggleImageSelection(image.id)}
                          className={`w-5 h-5 rounded border-2 ${
                            image.selected 
                              ? 'bg-indigo-600 border-indigo-600' 
                              : 'bg-white border-gray-300'
                          } flex items-center justify-center`}
                        >
                          {image.selected && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                        </button>
                      </div>
                      {image.is_featured && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm truncate">{image.title}</h3>
                      <p className="text-xs text-gray-500 capitalize mt-1">{image.category}</p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleToggleFeatured(image.id, image.is_featured)}
                          className={`flex-1 text-xs py-1 rounded transition ${
                            image.is_featured 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {image.is_featured ? '★ Featured' : '☆ Feature'}
                        </button>
                        <button
                          onClick={() => confirmDelete(image)}
                          className="flex-1 bg-red-50 text-red-600 text-xs py-1 rounded hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Select</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {images.map(image => (
                      <tr key={image.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={image.selected || false}
                            onChange={() => toggleImageSelection(image.id)}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <img 
                            src={`${API_BASE_URL}${image.image_url}`} 
                            alt={image.title} 
                            className="w-12 h-12 object-cover rounded" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium">{image.title}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs capitalize px-2 py-1 bg-gray-100 rounded-full">{image.category}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(image.date_uploaded).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleFeatured(image.id, image.is_featured)}
                            className={`text-sm ${image.is_featured ? 'text-yellow-500' : 'text-gray-400'}`}
                          >
                            {image.is_featured ? 'Featured' : 'Not featured'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => confirmDelete(image)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {images.length === 0 && (
              <div className="text-center py-16">
                <Image className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No images uploaded yet</p>
                <p className="text-sm text-gray-400 mt-1">Use the upload section above to add images</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
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
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingImage(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Delete Selected Images?</h3>
              <p className="text-gray-500 mt-1">
                Are you sure you want to delete {bulkDeleteCount} selected image(s)? This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleBulkDelete}
                  className="flex-1 bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition"
                >
                  Yes, Delete All
                </button>
                <button
                  onClick={() => {
                    setShowBulkDeleteModal(false);
                    setBulkDeleteCount(0);
                  }}
                  className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGalleryManager;