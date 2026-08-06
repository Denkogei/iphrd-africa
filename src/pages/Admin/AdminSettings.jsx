// src/pages/Admin/AdminSettings.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  User, Lock, Shield, Mail, Phone,
  LayoutDashboard, Newspaper, BookOpen, 
   Briefcase, Users, Settings, LogOut,
  Menu, Bell, UserCircle, Eye, EyeOff,
  Key, CheckCircle, Save, Target, Award,  Calendar, Image,
} from 'lucide-react';

function AdminSettings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  
  // Profile Settings
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    full_name: '',
    phone: '',
    bio: '',
    position: '',
    department: ''
  });
  
  // Password Settings
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  
  // Notification Settings
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    application_alerts: true
  });
  
  // Loading states
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setProfileData({
        username: parsedUser.username || '',
        email: parsedUser.email || '',
        full_name: parsedUser.full_name || '',
        phone: parsedUser.phone || '',
        bio: parsedUser.bio || '',
        position: parsedUser.position || '',
        department: parsedUser.department || ''
      });
      setLoading(false);
      fetchNotificationSettings();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchNotificationSettings = async () => {
    try {
      const response = await axios.get('https://trial.iphrdafrica.org/api/admin/settings/notifications', {
        withCredentials: true
      });
      if (response.data.success) {
        setNotifications({
          email_notifications: response.data.email_notifications,
          application_alerts: response.data.application_alerts
        });
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await axios.patch('https://trial.iphrdafrica.org/api/admin/profile', profileData, {
        withCredentials: true
      });
      if (response.data.success) {
        toast.success('Profile updated successfully!');
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.new_password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setUpdating(true);
    try {
      const response = await axios.post('https://trial.iphrdafrica.org/api/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password
      }, { withCredentials: true });
      
      if (response.data.success) {
        toast.success('Password changed successfully!');
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setUpdating(false);
    }
  };

  const handleNotificationChange = async (setting) => {
    const newValue = !notifications[setting];
    setNotifications(prev => ({ ...prev, [setting]: newValue }));
    
    try {
      const response = await axios.post('https://trial.iphrdafrica.org/api/admin/settings/notifications', {
        [setting]: newValue
      }, { withCredentials: true });
      
      if (response.data.success) {
        toast.success(`${setting.replace('_', ' ')} ${newValue ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      setNotifications(prev => ({ ...prev, [setting]: !newValue }));
      toast.error('Failed to save notification settings');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
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

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iphrd-green mx-auto"></div>
      </div>
    );
  }

  if (!user) {
    return null;
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-500 mt-1">Manage your account preferences</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6 overflow-x-auto">
            <div className="flex flex-wrap gap-1 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-all duration-200 rounded-t-lg ${
                    activeTab === tab.id
                      ? 'text-iphrd-green border-b-2 border-iphrd-green bg-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Profile Information</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position/Title</label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.position}
                        onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                        placeholder="e.g., Program Manager"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <div className="relative">
                      <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.department}
                        onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                        placeholder="e.g., Programs Department"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                    placeholder="Tell us a little about yourself..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-iphrd-green text-white rounded-lg hover:bg-iphrd-green/90 transition disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Change Password</h2>
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2">
                      {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                      required
                    />
                  </div>
                </div>
                <button type="submit" disabled={updating} className="px-6 py-2 bg-iphrd-green text-white rounded-lg hover:bg-iphrd-green/90 transition">
                  {updating ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Notification Preferences</h2>
              <p className="text-sm text-gray-500 mb-6">Configure how you receive alerts and updates</p>
              
              <div className="space-y-4">
                {/* Email Notifications */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive important updates via email</p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange('email_notifications')}
                    className={`w-12 h-6 rounded-full transition-colors ${notifications.email_notifications ? 'bg-iphrd-green' : 'bg-gray-300'}`}
                  >
                    <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${notifications.email_notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* Application Alerts */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800">Application Alerts</p>
                    <p className="text-sm text-gray-500">Get notified when new applications are submitted</p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange('application_alerts')}
                    className={`w-12 h-6 rounded-full transition-colors ${notifications.application_alerts ? 'bg-iphrd-green' : 'bg-gray-300'}`}
                  >
                    <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${notifications.application_alerts ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">How notifications work</p>
                    <p className="text-xs text-blue-600 mt-1">
                      When application alerts are enabled, you'll receive email notifications whenever someone submits a job application, volunteer form, or internship application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminSettings;