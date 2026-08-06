// src/pages/Media/BlogDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  ArrowLeft, 
  Share2, 
  Check,
  User,
  Tag,
  Clock,
  Heart,
  MessageCircle
} from 'lucide-react';

const API_BASE_URL = 'https://trial.iphrdafrica.org';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    fetchBlogPost();
  }, [id]);

  const fetchBlogPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/blog/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        setError('Blog post not found');
        setPost(null);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Blog post data received:', data);
      
      if (data && data.id) {
        setPost(data);
        fetchRelatedPosts(data);
      } else {
        setError('Blog post data is invalid');
        setPost(null);
      }
    } catch (error) {
      console.error('❌ Error fetching blog post:', error);
      setError('Failed to load blog post. Please try again later.');
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (currentPost) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blog`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const allPosts = await response.json();
        const related = allPosts
          .filter(p => p.id !== currentPost.id)
          .slice(0, 3);
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const getImageUrl = (post) => {
    if (!post || !post.featured_image) return null;
    if (post.featured_image.startsWith('http')) return post.featured_image;
    if (post.featured_image.startsWith('/uploads/')) return `${API_BASE_URL}${post.featured_image}`;
    return `${API_BASE_URL}/uploads/${post.featured_image}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const copyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleBack = () => {
    navigate('/media/blog');
  };

  const handleRelatedClick = (postId) => {
    navigate(`/media/blog/${postId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareVia = (platform) => {
    const url = window.location.href;
    const text = `Check out this blog post: ${post.title}`;
    let shareUrl = '';
    
    switch(platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-iphrd-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Blog post not found</h3>
          <p className="text-gray-400">
            {error || "The blog post you're looking for doesn't exist or has been removed."}
          </p>
          <button 
            onClick={handleBack}
            className="mt-4 inline-block bg-iphrd-blue-600 text-white px-6 py-2 rounded-lg hover:bg-iphrd-blue-700 transition"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(post);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <button 
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-iphrd-blue-600 transition group mb-6"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          Back to Blog
        </button>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Featured Image */}
          {imageUrl && (
            <div className="relative h-80 md:h-96">
              <img 
                src={imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8 lg:p-10">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.date_posted)}
                </span>
                {post.author && (
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
            </div>

            {/* Body with justified text */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-justify">
                {post.content}
              </p>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap justify-between items-center">
                <div className="text-sm text-gray-400">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Published on {formatDate(post.date_posted)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 mr-2">Share:</span>
                  <button
                    onClick={() => shareVia('twitter')}
                    className="p-2 text-gray-500 hover:text-blue-400 transition rounded-full hover:bg-blue-50"
                    aria-label="Share on Twitter"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => shareVia('facebook')}
                    className="p-2 text-gray-500 hover:text-blue-600 transition rounded-full hover:bg-blue-50"
                    aria-label="Share on Facebook"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => shareVia('linkedin')}
                    className="p-2 text-gray-500 hover:text-blue-700 transition rounded-full hover:bg-blue-50"
                    aria-label="Share on LinkedIn"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                  <button
                    onClick={copyShareLink}
                    className={`p-2 text-gray-500 hover:text-iphrd-green transition rounded-full hover:bg-green-50 ${
                      copied ? 'text-green-500' : ''
                    }`}
                    aria-label="Copy link"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <div 
                  key={relatedPost.id}
                  onClick={() => handleRelatedClick(relatedPost.id)}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden group"
                >
                  {relatedPost.featured_image && (
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={getImageUrl(relatedPost)} 
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-iphrd-blue-600 transition">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(relatedPost.date_posted)}
                    </p>
                    <button className="mt-2 text-iphrd-blue-600 text-sm font-medium hover:underline">
                      Read More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;