// src/pages/Media/BlogPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Tag, ArrowRight, Search, Clock } from 'lucide-react';

const BlogPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://trial.iphrdafrica.org/api/blog', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError('Failed to load blog posts.');
    } finally {
      setLoading(false);
    }
  };

  const handleReadMore = (postId) => {
    navigate(`/media/blog/${postId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get unique tags for filtering
  const getAllTags = () => {
    const allTags = posts.flatMap(post => post.tags || []);
    return [...new Set(allTags)];
  };

  // Filter posts by search term and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                          (post.tags && post.tags.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iphrd-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchBlogPosts} className="px-4 py-2 bg-iphrd-green text-white rounded-lg hover:bg-iphrd-green/90 transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-iphrd-green to-green-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog</h1>
          <div className="w-20 h-0.5 bg-white mx-auto"></div>
          <p className="text-white/80 text-base max-w-2xl mx-auto mt-4">
            Insights, stories, and perspectives from our team
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
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-iphrd-green focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                    selectedCategory === 'all'
                      ? 'bg-iphrd-green text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {getAllTags().slice(0, 6).map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                      selectedCategory === tag
                        ? 'bg-iphrd-green text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Showing {filteredPosts.length} of {posts.length} posts
            </p>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No blog posts found matching your criteria.</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                className="mt-2 text-iphrd-green hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  {/* Featured Image */}
                  <div className="relative h-56 overflow-hidden">
                    {post.featured_image ? (
                      <img 
                        src={post.featured_image} 
                        alt={post.title} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-iphrd-green/10 to-green-600/10 flex items-center justify-center">
                        <span className="text-iphrd-green text-6xl">📝</span>
                      </div>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        <span className="text-xs bg-black/60 text-white px-2 py-1 rounded-full">
                          {post.tags[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.date_posted)}
                      {post.author && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <User className="w-3 h-3" />
                          <span className="truncate max-w-[100px]">{post.author}</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 hover:text-iphrd-green transition">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 flex-grow">
                      {post.content.substring(0, 150)}...
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-gray-400 px-1 py-0.5">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    <button 
                      onClick={() => handleReadMore(post.id)}
                      className="mt-4 inline-flex items-center text-iphrd-green font-medium text-sm hover:text-iphrd-green/80 transition group"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button (if needed) */}
          {filteredPosts.length > 0 && filteredPosts.length < posts.length && (
            <div className="text-center mt-10">
              <button className="px-6 py-3 border-2 border-iphrd-green text-iphrd-green rounded-lg hover:bg-iphrd-green hover:text-white transition font-medium">
                Load More Posts
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;