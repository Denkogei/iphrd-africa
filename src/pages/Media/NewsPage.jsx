// src/pages/Media/NewsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, Video, X, Download, Eye, File, Search } from 'lucide-react';

const NewsPage = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://trial.iphrdafrica.org/api/news', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ News fetched:', data);
      setArticles(data);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleReadMore = (articleId) => {
    console.log('🔗 Navigating to news article:', articleId);
    navigate(`/media/news/${articleId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getFullUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `https://trial.iphrdafrica.org${url}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iphrd-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchNews} className="px-4 py-2 bg-iphrd-green text-white rounded-lg hover:bg-iphrd-green/90 transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-iphrd-green to-green-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-5">
            <span className="text-white text-xs font-medium">Stay Informed</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">News & Updates</h1>
          <div className="w-20 h-0.5 bg-white mx-auto"></div>
          <p className="text-white/80 text-base max-w-2xl mx-auto mt-4">
            Latest news, announcements, and tender opportunities from IPHRD-Africa
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter Bar */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search news articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-iphrd-green focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filterCategory === 'all'
                      ? 'bg-iphrd-green text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterCategory('news')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filterCategory === 'news'
                      ? 'bg-iphrd-green text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  News
                </button>
                <button
                  onClick={() => setFilterCategory('tender')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filterCategory === 'tender'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tenders
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Showing {filteredArticles.length} of {articles.length} articles
            </p>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No articles found matching your criteria.</p>
              <button 
                onClick={() => { setSearchTerm(''); setFilterCategory('all'); }}
                className="mt-2 text-iphrd-green hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => {
                const isTender = article.category === 'tender';
                return (
                  <div
                    key={article.id}
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col"
                    onClick={() => handleReadMore(article.id)}
                  >
                    {/* Media Preview */}
                    <div className="relative h-48 overflow-hidden">
                      {article.media_url && article.media_type === 'image' && (
                        <img 
                          src={getFullUrl(article.media_url)} 
                          alt={article.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                        />
                      )}
                      {article.media_url && article.media_type === 'video' && (
                        <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
                          <video src={getFullUrl(article.media_url)} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Video className="w-12 h-12 text-white" />
                          </div>
                        </div>
                      )}
                      {(!article.media_url || article.media_type === 'pdf') && (
                        <div className="h-full bg-gradient-to-br from-iphrd-green/10 to-green-600/10 flex items-center justify-center">
                          {isTender ? (
                            <File className="w-16 h-16 text-orange-500" />
                          ) : (
                            <FileText className="w-16 h-16 text-iphrd-green" />
                          )}
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        {isTender ? (
                          <span className="bg-orange-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                            TENDER
                          </span>
                        ) : (
                          <span className="bg-iphrd-green text-white text-xs font-medium px-2.5 py-1 rounded-full">
                            NEWS
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content with justified text */}
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <Calendar className="w-3 h-3" />
                        {formatDate(article.date_posted)}
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 hover:text-iphrd-green transition">
                        {article.title}
                      </h3>
                      {/* Added text-justify here */}
                      <p className="text-gray-600 text-sm line-clamp-3 flex-grow text-justify">
                        {article.content.substring(0, 150)}...
                      </p>
                      <div className="mt-4 inline-flex items-center text-iphrd-green text-sm font-medium hover:text-iphrd-green/80 transition group">
                        Read More
                        <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsPage;