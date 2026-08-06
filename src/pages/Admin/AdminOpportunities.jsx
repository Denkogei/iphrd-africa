// src/pages/Admin/AdminOpportunities.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Plus, Edit, Trash2, X, CheckCircle, XCircle, ArrowLeft, 
  Briefcase, TrendingUp, TrendingDown,
  Users, Target, Download, Search, Info,
  LayoutDashboard, Newspaper, BookOpen, 
   Settings, LogOut, Menu, Bell, UserCircle, Image, Calendar,
  Clock
} from 'lucide-react';

function AdminOpportunities() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Full-time',
    status: 'Open',
    location: '',
    deadline: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [applications, setApplications] = useState({});

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
      fetchOpportunities();
      fetchApplicationsCount();
    }
  }, [user]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://trial.iphrdafrica.org/api/opportunities');
      setOpportunities(response.data);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationsCount = async () => {
    try {
      const response = await axios.get('https://trial.iphrdafrica.org/api/admin/applications/count', {
        withCredentials: true
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications count:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openCreateForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      type: 'Full-time',
      status: 'Open',
      location: '',
      deadline: '',
      description: ''
    });
    setShowForm(true);
  };

  const openEditForm = (opp) => {
    setEditingId(opp.id);
    setFormData({
      title: opp.title,
      type: opp.type,
      status: opp.status,
      location: opp.location,
      deadline: opp.deadline,
      description: opp.description
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const url = editingId 
        ? `https://trial.iphrdafrica.org/api/admin/opportunities/${editingId}`
        : 'https://trial.iphrdafrica.org/api/admin/opportunities';
      
      const method = editingId ? 'patch' : 'post';
      
      const response = await axios[method](url, formData, {
        withCredentials: true
      });
      
      if (response.data.success) {
        toast.success(editingId ? 'Opportunity updated successfully!' : 'Opportunity created successfully!');
        setShowForm(false);
        fetchOpportunities();
        fetchApplicationsCount();
      }
    } catch (error) {
      console.error('Error saving opportunity:', error);
      toast.error(error.response?.data?.error || 'Failed to save opportunity');
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
      await axios.delete(`https://trial.iphrdafrica.org/api/admin/opportunities/${deleteId}`, {
        withCredentials: true
      });
      toast.success('Opportunity deleted successfully!');
      fetchOpportunities();
      fetchApplicationsCount();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      toast.error('Failed to delete opportunity');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Open' ? 'Closed' : 'Open';
    try {
      await axios.patch(`https://trial.iphrdafrica.org/api/admin/opportunities/${id}`, 
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success(`Opportunity ${newStatus.toLowerCase()}`);
      fetchOpportunities();
      
      if (newStatus === 'Closed') {
        toast.info('Closed jobs are automatically hidden from the public website');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getTypeBadgeColor = (type) => {
    switch(type) {
      case 'Full-time': return 'bg-blue-100 text-blue-700';
      case 'Part-time': return 'bg-green-100 text-green-700';
      case 'Internship': return 'bg-purple-100 text-purple-700';
      case 'Consultancy': return 'bg-orange-100 text-orange-700';
      case 'Volunteer': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opp.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || opp.type === filterType;
    const matchesStatus = filterStatus === 'all' || opp.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: opportunities.length,
    open: opportunities.filter(o => o.status === 'Open').length,
    closed: opportunities.filter(o => o.status === 'Closed').length,
    fullTime: opportunities.filter(o => o.type === 'Full-time').length,
    partTime: opportunities.filter(o => o.type === 'Part-time').length,
    internship: opportunities.filter(o => o.type === 'Internship').length,
    totalApplications: Object.values(applications).reduce((a, b) => a + b, 0)
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );

  const exportToCSV = () => {
    const headers = ['Title', 'Type', 'Location', 'Deadline', 'Status', 'Posted Date', 'Applications'];
    const data = filteredOpportunities.map(opp => [
      opp.title,
      opp.type,
      opp.location,
      opp.deadline,
      opp.status,
      new Date(opp.date_posted).toLocaleDateString(),
      applications[opp.id] || 0
    ]);
    
    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `opportunities_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export successful!');
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iphrd-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading opportunities...</p>
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
        {/* Logo Section */}
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

        {/* User Info */}
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

        {/* Navigation */}
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

        {/* Logout Button */}
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

        {/* Content */}
        <div className="p-6 lg:p-8">
          {/* Header with Actions */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Opportunities Management</h1>
              <p className="text-gray-500 mt-1">Manage job postings, track applications, and monitor performance</p>
            </div>
            <div className="flex gap-3 mt-3 sm:mt-0">
              <button
                onClick={openCreateForm}
                className="px-4 py-2 bg-iphrd-green text-white rounded-lg hover:bg-iphrd-green/90 transition flex items-center gap-2 font-medium"
              >
                <Plus className="w-4 h-4" />
                New Opportunity
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard 
              title="Total Opportunities" 
              value={stats.total} 
              icon={Briefcase}
              color="bg-blue-500"
              trend={+12}
            />
            <StatCard 
              title="Open Positions" 
              value={stats.open} 
              icon={Target}
              color="bg-green-500"
            />
            <StatCard 
              title="Closed Positions" 
              value={stats.closed} 
              icon={CheckCircle}
              color="bg-gray-500"
            />
            <StatCard 
              title="Total Applications" 
              value={stats.totalApplications} 
              icon={Users}
              color="bg-purple-500"
              trend={+23}
            />
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-100 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Full-time</p>
              <p className="text-xl font-bold text-gray-800">{stats.fullTime}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-100 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Part-time</p>
              <p className="text-xl font-bold text-gray-800">{stats.partTime}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-100 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Internships</p>
              <p className="text-xl font-bold text-gray-800">{stats.internship}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-100 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Avg. Applications/Job</p>
              <p className="text-xl font-bold text-gray-800">
                {stats.total > 0 ? Math.round(stats.totalApplications / stats.total) : 0}
              </p>
            </div>
          </div>
          
          {/* Create/Edit Form */}
          {showForm && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {editingId ? 'Edit Opportunity' : 'Create New Opportunity'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingId ? 'Update the job details below' : 'Fill in the details to create a new job posting'}
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-iphrd-green focus:border-transparent"
                    placeholder="e.g., Program Officer - Peace-building"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Consultancy">Consultancy</option>
                      <option value="Volunteer">Volunteer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                    >
                      <option value="Open">Open (Visible on website)</option>
                      <option value="Closed">Closed (Hidden from website)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.status === 'Closed' ? 'Closed jobs will not appear on the public opportunities page' : 'Open jobs will be visible to applicants'}
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                      placeholder="e.g., Nairobi, Kenya"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
                    <input
                      type="text"
                      name="deadline"
                      required
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                      placeholder="e.g., Open until filled, May 30, 2024"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
                  <textarea
                    name="description"
                    required
                    rows="12"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-iphrd-green font-mono text-sm"
                    placeholder={`Example format:

Job Description:
An accountant manages financial records, prepares reports, and ensures compliance with tax laws and regulations.

Requirements:
• Bachelor's degree in Accounting or Finance
• CPA certification or equivalent
• 3+ years of accounting experience
• Proficiency in QuickBooks or similar accounting software

Responsibilities:
• Prepare and maintain accurate financial records
• Manage accounts payable and receivable
• Perform monthly bank reconciliations
• Prepare monthly, quarterly, and annual financial reports`}
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-2">
                    <strong>Tip:</strong> Use clear section headers like "Job Description:", "Requirements:", and "Responsibilities:" for better organization. Use bullet points (•) for lists.
                  </p>
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-iphrd-green text-white rounded-lg hover:bg-iphrd-green/90 transition disabled:opacity-50 font-medium"
                  >
                    {submitting ? (editingId ? 'Saving...' : 'Creating...') : (editingId ? 'Save Changes' : 'Create Opportunity')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search opportunities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                >
                  <option value="all">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Consultancy">Consultancy</option>
                  <option value="Volunteer">Volunteer</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                >
                  <option value="all">All Status</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Opportunities Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOpportunities.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                        No opportunities found. Click "New Opportunity" to create one.
                      </td>
                    </tr>
                  ) : (
                    filteredOpportunities.map((opp) => (
                      <tr key={opp.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{opp.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">
                              {opp.description.substring(0, 60)}...
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getTypeBadgeColor(opp.type)}`}>
                            {opp.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{opp.location}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{opp.deadline}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleStatus(opp.id, opp.status)}
                            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition ${
                              opp.status === 'Open' 
                                ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {opp.status === 'Open' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {opp.status}
                          </button>
                          {opp.status === 'Closed' && (
                            <p className="text-xs text-gray-400 mt-1">Hidden from website</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">{applications[opp.id] || 0}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(opp.date_posted).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditForm(opp)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => confirmDelete(opp.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing {filteredOpportunities.length} of {opportunities.length} opportunities
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-white transition disabled:opacity-50">
                  Previous
                </button>
                <button className="px-3 py-1 text-sm bg-iphrd-green text-white rounded-lg hover:bg-iphrd-green/90 transition">
                  1
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-white transition">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Note: Job Visibility & Formatting</p>
                <p className="text-xs text-blue-600 mt-1">
                  • <strong>Open</strong> jobs are visible on the public opportunities page<br/>
                  • <strong>Closed</strong> jobs are automatically hidden from public view<br/>
                  • Use clear section headers (Job Description:, Requirements:, Responsibilities:) for better organization<br/>
                  • Use bullet points (•) for lists to improve readability
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Opportunity</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this opportunity? This action cannot be undone and will remove all associated applications.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
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

export default AdminOpportunities;