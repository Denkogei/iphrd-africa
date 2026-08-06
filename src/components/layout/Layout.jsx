// src/components/layout/Layout.jsx
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Check if the current path is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // For admin routes, only show children (the admin content) - NO navbar or footer
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }
  
  // For public routes, show full layout with navbar and footer
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;