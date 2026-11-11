import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Newspaper, BookOpen, Briefcase, Users,
  Settings, LogOut, Menu, Bell, UserCircle, Calendar, Image,
  Globe, FileText,   
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // UPDATED MENU - Added Engagements
const menuItems = [
  { name: 'Overview',      icon: LayoutDashboard, path: '/admin',            exact: true },
  { name: 'News',          icon: Newspaper,       path: '/admin/news' },
  { name: 'Blog',          icon: BookOpen,        path: '/admin/blog' },
  { name: 'Publications',  icon: FileText,        path: '/admin/publications' },  // ← NEW
  { name: 'Our Events',    icon: Calendar,        path: '/admin/events' },
  { name: 'Engagements',   icon: Globe,           path: '/admin/engagements' },
  { name: 'Opportunities', icon: Briefcase,       path: '/admin/opportunities' },
  { name: 'Applications',  icon: Users,           path: '/admin/applications' },
  { name: 'Gallery',       icon: Image,           path: '/admin/gallery' },
  { name: 'Settings',      icon: Settings,        path: '/admin/settings' },
];

  const handleExit = () => {
    if (window.confirm('Exit Admin Panel? You will be redirected to the homepage.')) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

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
              <p className="text-base font-semibold text-gray-800">{user?.username || 'Admin'}</p>
              <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-iphrd-green"></span>
                {user?.role || 'Administrator'}
              </p>
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
                `flex items-center gap-3 px-4 py-3 mb-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-iphrd-green/10 to-iphrd-blue/10 text-iphrd-green shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-100 bg-white">
          <button
            onClick={handleExit}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

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
              </button>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-iphrd-green to-iphrd-blue rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{user?.username?.charAt(0).toUpperCase() || 'A'}</span>
                </div>
                <span className="text-sm text-gray-600 hidden sm:block">{user?.username || 'Admin'}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;