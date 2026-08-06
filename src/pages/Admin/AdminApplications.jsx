// src/pages/Admin/AdminApplications.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Users, Eye, Search,  Mail,
  CheckCircle, XCircle, Clock, Phone,
  FileText, ExternalLink, Briefcase, Calendar,
  RefreshCw, MessageSquare,
  FileSpreadsheet, CheckSquare, Square,
  LayoutDashboard, Newspaper, BookOpen, 
  Settings, LogOut, Menu, Bell, UserCircle,
  Heart, GraduationCap, Trash2, Image
} from 'lucide-react';

function AdminApplications() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('vacancies');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedApps, setSelectedApps] = useState([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    accepted: 0,
    rejected: 0,
    opportunities: 0,
    volunteer: 0,
    internship: 0
  });

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
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://trial.iphrdafrica.org/api/admin/applications', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Response:', response.data);
      setApplications(response.data);
      
      setStats({
        total: response.data.length,
        pending: response.data.filter(a => a.status === 'pending').length,
        reviewed: response.data.filter(a => a.status === 'reviewed').length,
        shortlisted: response.data.filter(a => a.status === 'shortlisted').length,
        accepted: response.data.filter(a => a.status === 'accepted').length,
        rejected: response.data.filter(a => a.status === 'rejected').length,
        opportunities: response.data.filter(a => a.application_type === 'opportunity').length,
        volunteer: response.data.filter(a => a.application_type === 'volunteer').length,
        internship: response.data.filter(a => a.application_type === 'internship').length
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        toast.error('Please login again');
        navigate('/login');
      } else {
        toast.error('Failed to load applications');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async (applicationId) => {
    try {
      const response = await axios.get(`https://trial.iphrdafrica.org/api/admin/applications/${applicationId}/notes`, {
        withCredentials: true
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes([]);
    }
  };

  const updateApplicationStatus = async (id, newStatus) => {
    setUpdatingStatus(true);
    try {
      await axios.patch(`https://trial.iphrdafrica.org/api/admin/applications/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success(`Application status updated to ${newStatus}`);
      fetchApplications();
      if (showDetailModal) {
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const addNote = async () => {
    if (!selectedApplication || !noteText.trim()) {
      toast.error('Please enter a note');
      return;
    }
    
    try {
      await axios.post(`https://trial.iphrdafrica.org/api/admin/applications/${selectedApplication.id}/notes`, {
        note: noteText
      }, { withCredentials: true });
      
      toast.success('Note added successfully');
      setShowNoteModal(false);
      setNoteText('');
      fetchNotes(selectedApplication.id);
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error(error.response?.data?.error || 'Failed to add note');
    }
  };

  // Delete single application
  const deleteApplication = async (id) => {
    setDeleting(true);
    try {
      await axios.delete(`https://trial.iphrdafrica.org/api/admin/applications/${id}`, {
        withCredentials: true
      });
      
      toast.success('Application deleted successfully');
      
      // Remove from local state
      setApplications(applications.filter(app => app.id !== id));
      setSelectedApps(selectedApps.filter(appId => appId !== id));
      
      // Close modal if open
      if (showDetailModal) {
        setShowDetailModal(false);
        setSelectedApplication(null);
      }
      
      // Refresh stats
      await fetchApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error(error.response?.data?.error || 'Failed to delete application');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
      setApplicationToDelete(null);
    }
  };

  // Bulk delete applications
  const bulkDeleteApplications = async () => {
    if (selectedApps.length === 0) return;
    
    setDeleting(true);
    try {
      const response = await axios.post('https://trial.iphrdafrica.org/api/admin/applications/bulk-delete', {
        application_ids: selectedApps
      }, {
        withCredentials: true
      });
      
      toast.success(response.data.message);
      
      // Remove deleted apps from state
      setApplications(applications.filter(app => !selectedApps.includes(app.id)));
      setSelectedApps([]);
      
      // Close modal if the deleted app was open
      if (showDetailModal && selectedApplication && selectedApps.includes(selectedApplication.id)) {
        setShowDetailModal(false);
        setSelectedApplication(null);
      }
      
      // Refresh stats
      await fetchApplications();
    } catch (error) {
      console.error('Error bulk deleting:', error);
      toast.error(error.response?.data?.error || 'Failed to delete applications');
    } finally {
      setDeleting(false);
    }
  };

  // Delete all test applications
  const deleteTestApplications = async () => {
    const testApps = applications.filter(app => 
      app.email?.toLowerCase().includes('test') || 
      app.email?.toLowerCase().includes('example') || 
      app.full_name?.toLowerCase().includes('test') ||
      app.full_name?.toLowerCase().includes('sample')
    );
    
    if (testApps.length === 0) {
      toast.info('No test applications found');
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete ${testApps.length} test application(s)? This action cannot be undone.`)) {
      return;
    }
    
    setDeleting(true);
    try {
      const response = await axios.post('https://trial.iphrdafrica.org/api/admin/applications/bulk-delete', {
        application_ids: testApps.map(app => app.id)
      }, {
        withCredentials: true
      });
      
      toast.success(response.data.message);
      await fetchApplications();
    } catch (error) {
      console.error('Error deleting test applications:', error);
      toast.error('Failed to delete test applications');
    } finally {
      setDeleting(false);
    }
  };

  const exportToCSV = () => {
    const filtered = getFilteredApplications();
    const headers = ['Name', 'Email', 'Phone', 'Position', 'Status', 'Applied Date'];
    const rows = filtered.map(app => [
      app.full_name,
      app.email,
      app.phone || '',
      app.opportunity_title || getApplicationTypeLabel(app),
      app.status,
      new Date(app.date_applied).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}_applications_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export successful!');
  };

  const bulkUpdateStatus = async (newStatus) => {
    if (selectedApps.length === 0) return;
    
    try {
      await Promise.all(selectedApps.map(id => 
        axios.patch(`https://trial.iphrdafrica.org/api/admin/applications/${id}`, 
          { status: newStatus }, 
          { withCredentials: true }
        )
      ));
      
      toast.success(`Updated ${selectedApps.length} applications to ${newStatus}`);
      setSelectedApps([]);
      fetchApplications();
    } catch (error) {
      console.error('Error bulk updating:', error);
      toast.error('Failed to update some applications');
    }
  };

  const toggleSelect = (id) => {
    if (selectedApps.includes(id)) {
      setSelectedApps(selectedApps.filter(appId => appId !== id));
    } else {
      setSelectedApps([...selectedApps, id]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getApplicationType = (app) => {
    if (app.application_type === 'volunteer') return 'volunteer';
    if (app.application_type === 'internship') return 'internship';
    return 'opportunity';
  };

  const getApplicationTypeLabel = (app) => {
    if (app.application_type === 'volunteer') return 'Volunteer';
    if (app.application_type === 'internship') return 'Internship';
    return 'Vacancy';
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pending' },
      reviewed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Eye, label: 'Reviewed' },
      shortlisted: { bg: 'bg-purple-100', text: 'text-purple-700', icon: CheckCircle, label: 'Shortlisted' },
      accepted: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Accepted' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Rejected' }
    };
    const c = config[status] || config.pending;
    const Icon = c.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        <Icon className="w-3 h-3" />
        {c.label}
      </span>
    );
  };

  const getFilteredApplications = () => {
    let typeFilter = 'all';
    if (activeTab === 'vacancies') typeFilter = 'opportunity';
    else if (activeTab === 'internship') typeFilter = 'internship';
    else if (activeTab === 'volunteer') typeFilter = 'volunteer';
    
    return applications.filter(app => {
      const matchesSearch = app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            app.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
      const matchesType = typeFilter === 'all' || getApplicationType(app) === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  };

  const getTabCount = () => {
    if (activeTab === 'vacancies') return stats.opportunities;
    if (activeTab === 'internship') return stats.internship;
    if (activeTab === 'volunteer') return stats.volunteer;
    return stats.total;
  };

  const getFullUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `https://trial.iphrdafrica.org${url}`;
  };

  const isWord = (url) => {
    return url && (url.toLowerCase().endsWith('.doc') || url.toLowerCase().endsWith('.docx'));
  };

  const isPDF = (url) => {
    return url && url.toLowerCase().endsWith('.pdf');
  };

  const openCV = (url) => {
    const fullUrl = getFullUrl(url);
    if (isWord(url)) {
      const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fullUrl)}&embedded=true`;
      window.open(viewerUrl, '_blank');
    } else {
      window.open(fullUrl, '_blank');
    }
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

  const filteredApplications = getFilteredApplications();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iphrd-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

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
                {stats.pending > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
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
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('vacancies')}
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'vacancies'
                    ? 'text-iphrd-green border-b-2 border-iphrd-green'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Vacancies
                <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{stats.opportunities}</span>
              </button>
              <button
                onClick={() => setActiveTab('internship')}
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'internship'
                    ? 'text-iphrd-green border-b-2 border-iphrd-green'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Internship
                <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{stats.internship}</span>
              </button>
              <button
                onClick={() => setActiveTab('volunteer')}
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'volunteer'
                    ? 'text-iphrd-green border-b-2 border-iphrd-green'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Heart className="w-4 h-4" />
                Volunteer
                <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{stats.volunteer}</span>
              </button>
            </div>
          </div>

          {/* Header Info */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {activeTab === 'vacancies' ? 'Vacancy Applications' : activeTab === 'internship' ? 'Internship Applications' : 'Volunteer Applications'}
              </h1>
              <p className="text-gray-500 mt-1">
                {activeTab === 'vacancies' ? 'Review and manage job vacancy applications' : 
                 activeTab === 'internship' ? 'Review and manage internship applications' :
                 'Review and manage volunteer applications'}
              </p>
            </div>
            <div className="flex gap-3 mt-3 sm:mt-0">
              <button 
                onClick={exportToCSV}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export CSV
              </button>
              <button 
                onClick={fetchApplications}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button 
                onClick={deleteTestApplications}
                disabled={deleting}
                className="px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Test Apps
              </button>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                filterStatus === 'all'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({filteredApplications.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                filterStatus === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilterStatus('reviewed')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                filterStatus === 'reviewed'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              Reviewed ({stats.reviewed})
            </button>
            <button
              onClick={() => setFilterStatus('shortlisted')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                filterStatus === 'shortlisted'
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
              }`}
            >
              Shortlisted ({stats.shortlisted})
            </button>
            <button
              onClick={() => setFilterStatus('accepted')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                filterStatus === 'accepted'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
              }`}
            >
              Accepted ({stats.accepted})
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                filterStatus === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg border border-gray-100 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-iphrd-green"
              />
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedApps.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-800">{selectedApps.length} applications selected</span>
              </div>
              <div className="flex gap-2">
                <select 
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'delete') {
                      if (window.confirm(`Delete ${selectedApps.length} applications? This cannot be undone.`)) {
                        bulkDeleteApplications();
                      }
                    } else if (value) {
                      bulkUpdateStatus(value);
                    }
                    e.target.value = '';
                  }}
                  className="px-3 py-1 text-sm border border-blue-300 rounded-lg bg-white"
                  defaultValue=""
                >
                  <option value="" disabled>Bulk Actions</option>
                  <option value="reviewed">Mark as Reviewed</option>
                  <option value="shortlisted">Shortlist</option>
                  <option value="accepted">Accept</option>
                  <option value="rejected">Reject</option>
                  <option value="delete" className="text-red-600">🗑 Delete Selected</option>
                </select>
                <button 
                  onClick={() => setSelectedApps([])}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Applications Cards */}
          <div className="space-y-3">
            {filteredApplications.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No applications found for {activeTab}</p>
              </div>
            ) : (
              filteredApplications.map((app) => (
                <div key={app.id} className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex-shrink-0">
                      <button onClick={() => toggleSelect(app.id)} className="p-1">
                        {selectedApps.includes(app.id) ? 
                          <CheckSquare className="w-5 h-5 text-iphrd-green" /> : 
                          <Square className="w-5 h-5 text-gray-400" />
                        }
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-semibold text-gray-600">
                          {app.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{app.full_name}</h3>
                        <p className="text-xs text-gray-500">{app.email}</p>
                        {app.opportunity_title && getApplicationType(app) === 'opportunity' && (
                          <p className="text-xs text-iphrd-green mt-1">• {app.opportunity_title}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedApplication(app);
                          fetchNotes(app.id);
                          setShowDetailModal(true);
                        }}
                        className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Review
                      </button>
                      {app.cv_url && (
                        <button
                          onClick={() => openCV(app.cv_url)}
                          className="px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition flex items-center gap-1"
                        >
                          <FileText className="w-4 h-4" />
                          View CV
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setApplicationToDelete(app.id);
                          setShowDeleteConfirm(true);
                        }}
                        disabled={deleting}
                        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 text-center text-xs text-gray-400">
            Showing {filteredApplications.length} of {getTabCount()} {activeTab} applications
          </div>
        </div>
      </main>

      {/* Review Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Review Application</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-iphrd-green to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{selectedApplication.full_name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedApplication.full_name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedApplication.application_type === 'internship' ? 
                      'Internship Application' : 
                      selectedApplication.application_type === 'volunteer' ?
                      'Volunteer Application' :
                      `Applied for: ${selectedApplication.opportunity_title || 'Vacancy'}`
                    }
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{selectedApplication.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{selectedApplication.phone || 'No phone provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">Applied: {new Date(selectedApplication.date_applied).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-gray-400" />
                  {selectedApplication.cv_url ? (
                    <button
                      onClick={() => openCV(selectedApplication.cv_url)}
                      className="text-iphrd-green hover:underline flex items-center gap-1"
                    >
                      View CV <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-gray-500">No CV uploaded</span>
                  )}
                </div>
              </div>

              {selectedApplication.cover_letter && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Cover Letter</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
                  </div>
                </div>
              )}

              {notes.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Previous Notes</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {notes.map((note) => (
                      <div key={note.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-medium text-gray-600">{note.created_by || 'Admin'}</span>
                          <span className="text-xs text-gray-400">
                            {note.created_at ? new Date(note.created_at).toLocaleString() : 'Just now'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{note.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setShowNoteModal(true)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Add Note
                </button>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateApplicationStatus(selectedApplication.id, status)}
                      disabled={updatingStatus}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition capitalize ${
                        selectedApplication.status === status
                          ? 'bg-iphrd-green text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => {
                  setApplicationToDelete(selectedApplication.id);
                  setShowDetailModal(false);
                  setShowDeleteConfirm(true);
                }}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Application
              </button>
              <button 
                onClick={() => setShowDetailModal(false)} 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showNoteModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Add Note</h2>
              <button onClick={() => setShowNoteModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6">
              <textarea
                rows="4"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                placeholder="Add your notes about this candidate..."
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={addNote}
                  className="flex-1 bg-iphrd-green text-white px-4 py-2 rounded-lg hover:bg-iphrd-green/80 transition"
                >
                  Add Note
                </button>
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Confirm Delete</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <p className="text-gray-600 text-center mb-2">
                Are you sure you want to delete this application?
              </p>
              <p className="text-sm text-gray-500 text-center">
                This action cannot be undone and will permanently remove the application and all associated data.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setApplicationToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (applicationToDelete) {
                    deleteApplication(applicationToDelete);
                  }
                }}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminApplications;