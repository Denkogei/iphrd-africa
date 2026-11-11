import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout'; 

// Import all pages
import Home from './pages/Home';
import WhoWeAre from './pages/About/WhoWeAre';
import Objectives from './pages/About/Objectives';
import BoardOfDirectors from './pages/About/BoardOfDirectors';
import VisionMission from './pages/About/VisionMission';
import OurTeam from './pages/About/OurTeam';
import OurPartners from './pages/About/OurPartners';
import ScopeProgrammes from './pages/Programmes/ScopeProgrammes';
import YoungWomenLeaders from './pages/Programmes/YoungWomenLeaders';
import YoungAfricanPeacemakers from './pages/Programmes/YoungAfricanPeacemakers';
import YoungCitizensJournalist from './pages/Programmes/YoungCitizensJournalist';
import Opportunities from './pages/GetInvolved/Opportunities';
import Volunteer from './pages/GetInvolved/Volunteer';
import Internship from './pages/GetInvolved/Internship';
import SupportEvents from './pages/GetInvolved/SupportEvents';
// import Publications from './pages/Resources/Publications';
import Complaints from './pages/Complaints';
import Contacts from './pages/Contacts';
import Donate from './pages/Donate';
import JobDetails from './pages/GetInvolved/JobDetails';
import NewsPage from './pages/Media/NewsPage';
import BlogPage from './pages/Media/BlogPage';
import PressPage from './pages/Media/PressPage';
import ReportsPage from './pages/Media/ReportsPage';
import TendersPage from './pages/Media/TendersPage';
import Gallery from './pages/Media/GalleryPage';
import OurEvents from './pages/Media/OurEvents';
import EventDetail from './pages/Media/EventDetail';
import BlogDetail from './pages/Media/BlogDetail';
import Global from './pages/Engagement/Global';
import Regional from './pages/Engagement/Regional';
import National from './pages/Engagement/National';
import Community from './pages/Engagement/Community';
import YouthPeaceIndex from './pages/Programmes/YouthPeaceIndex';
import Publications from './pages/Publications';



// Import Admin components
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminNews from './pages/Admin/AdminNews';
import AdminLogin from './pages/Admin/Login';
import NewsDetail from './pages/Admin/NewsDetail';
import AdminOpportunities from './pages/Admin/AdminOpportunities';
import AdminApplications from './pages/Admin/AdminApplications';
import AdminBlog from './pages/Admin/AdminBlog';
import AdminPress from './pages/Admin/AdminPress';
import AdminSettings from './pages/Admin/AdminSettings';
import AdminGalleryManager from './pages/Admin/AdminGalleryManager';
import AdminEvents from './pages/Admin/AdminEvents';
import EngagementManagement from './pages/Admin/EngagementManagement';
import AdminPublications from './pages/Admin/AdminPublications';

function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<AdminLogin />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          isAuthenticated ? <AdminLayout><AdminDashboard /></AdminLayout> : <Navigate to="/login" />
        } />
        <Route path="/admin/dashboard" element={
          isAuthenticated ? <AdminLayout><AdminDashboard /></AdminLayout> : <Navigate to="/login" />
        } />
        <Route path="/admin/news" element={
          isAuthenticated ? <AdminLayout><AdminNews /></AdminLayout> : <Navigate to="/login" />
        } />
        <Route path="/admin/news/:id" element={
          isAuthenticated ? <AdminLayout><NewsDetail /></AdminLayout> : <Navigate to="/login" />
        } />
        <Route path="/admin/opportunities" element={
          isAuthenticated ? <AdminLayout><AdminOpportunities /></AdminLayout> : <Navigate to="/login" />
        } />
        <Route path="/admin/applications" element={
          isAuthenticated ? <AdminLayout><AdminApplications /></AdminLayout> : <Navigate to="/login" />
        } />
        <Route path="/admin/blog" element={
          isAuthenticated ? <AdminLayout><AdminBlog /></AdminLayout> : <Navigate to="/login" />
        } />
        <Route path="/admin/press" element={
          isAuthenticated ? <AdminLayout><AdminPress /></AdminLayout> : <Navigate to="/login" />
        } />
        <Route path="/admin/publications" element={ <AdminLayout> <AdminPublications /> </AdminLayout> }/>

        <Route path="/admin/settings" element={
          isAuthenticated ? <AdminLayout><AdminSettings /></AdminLayout> : <Navigate to="/login" />
        } />
        <Route path="/admin/gallery" element={
          isAuthenticated ? <AdminLayout><AdminGalleryManager /></AdminLayout> : <Navigate to="/login" />
        } />
        <Route path="/admin/events" element={
          isAuthenticated ? <AdminLayout><AdminEvents /></AdminLayout> : <Navigate to="/login" />
        } />
        <Route path="/admin/engagements" element={
          isAuthenticated ? <AdminLayout><EngagementManagement /></AdminLayout> : <Navigate to="/login" />
        } />


        {/* Public Routes - About Us */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/who-we-are" element={<Layout><WhoWeAre /></Layout>} />
        <Route path="/objectives" element={<Layout><Objectives /></Layout>} />
        <Route path="/board" element={<Layout><BoardOfDirectors /></Layout>} />
        <Route path="/vision-mission" element={<Layout><VisionMission /></Layout>} />
        <Route path="/team" element={<Layout><OurTeam /></Layout>} />
        <Route path="/partners" element={<Layout><OurPartners /></Layout>} />
        <Route path="/youth-peace-index" element={<Layout><YouthPeaceIndex /></Layout>} />

        
        {/* Public Routes - Programmes */}
        <Route path="/scope-programmes" element={<Layout><ScopeProgrammes /></Layout>} />
        <Route path="/young-women-leaders" element={<Layout><YoungWomenLeaders /></Layout>} />
        <Route path="/young-african-peacemakers" element={<Layout><YoungAfricanPeacemakers /></Layout>} />
        <Route path="/young-citizens-journalist" element={<Layout><YoungCitizensJournalist /></Layout>} />
        <Route path="/opportunities/:id" element={<Layout><JobDetails /></Layout>} />

        {/* Public Routes - Get Involved */}
        <Route path="/opportunities" element={<Layout><Opportunities /></Layout>} />
        <Route path="/volunteer" element={<Layout><Volunteer /></Layout>} />
        <Route path="/internship" element={<Layout><Internship /></Layout>} />
        <Route path="/support-events" element={<Layout><SupportEvents /></Layout>} />
        
        {/* Public Routes - Media */}
        <Route path="/media/news" element={<Layout><NewsPage /></Layout>} />
        <Route path="/media/blog" element={<Layout><BlogPage /></Layout>} />
        <Route path="/media/press" element={<Layout><PressPage /></Layout>} />
        <Route path="/media/reports" element={<Layout><ReportsPage /></Layout>} />
        <Route path="/media/tenders" element={<Layout><TendersPage /></Layout>} />
        <Route path="/media/gallery" element={<Layout><Gallery /></Layout>} />
        <Route path="/media/our-events" element={<Layout><OurEvents /></Layout>} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/media/blog/:id" element={<Layout><BlogDetail /></Layout>} />
        <Route path="/media/news/:id" element={<Layout><NewsDetail /></Layout>} />
        
        {/* Public Routes - Resources */}
        <Route path="/publications" element={<Layout><Publications /></Layout>} />
        
        {/* Public Routes - Other */}
        <Route path="/complaints" element={<Layout><Complaints /></Layout>} />
        <Route path="/contacts" element={<Layout><Contacts /></Layout>} />
        <Route path="/donate" element={<Layout><Donate /></Layout>} />
        <Route path="/publications" element={<Publications />} />
           {/* Engagement */}
        <Route path="/engagements/global" element={<Layout><Global /></Layout>} />
        <Route path="/engagements/regional" element={<Layout><Regional /></Layout>} />
        <Route path="/engagements/national" element={<Layout><National /></Layout>} />
        <Route path="/engagements/community" element={<Layout><Community /></Layout>} />
        
        {/* 404 Not Found Route */}
        <Route path="*" element={
          <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
              <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
              <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
              <a href="/" className="inline-block bg-iphrd-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-iphrd-green transition">
                Return Home
              </a>
            </div>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;