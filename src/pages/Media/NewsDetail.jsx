// src/pages/Media/NewsDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  ArrowLeft, 
  Share2, 
  Check,
  FileText,
  Video,
  Download,
  Clock,
  File,
  ExternalLink
} from 'lucide-react';

// USE THE IP ADDRESS DIRECTLY - THIS BYPASSES DNS COMPLETELY
const API_BASE_URL = 'http://217.20.124.84';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    if (id) {
      console.log('📡 Fetching news article with ID:', id);
      fetchNewsArticle();
    } else {
      setError('No article ID provided');
      setLoading(false);
    }
  }, [id]);

  const fetchNewsArticle = async () => {
    setLoading(true);
    setError(null);
    try {
      // USE IP ADDRESS - NO DNS LOOKUP
      const url = `${API_BASE_URL}/api/news/${id}`;
      console.log('📡 Fetching from URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Host': 'trial.iphrdafrica.org',
        },
      });

      console.log('📡 Response status:', response.status);

      if (response.status === 404) {
        setError('News article not found');
        setArticle(null);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ News article data received:', data);
      
      if (data && data.id) {
        setArticle(data);
        fetchRelatedArticles(data);
      } else {
        setError('News article data is invalid');
        setArticle(null);
      }
    } catch (error) {
      console.error('❌ Error fetching news article:', error);
      setError('Failed to load news article. Please try again later.');
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async (currentArticle) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Host': 'trial.iphrdafrica.org',
        },
      });

      if (response.ok) {
        const allArticles = await response.json();
        const related = allArticles
          .filter(a => a.id !== currentArticle.id)
          .slice(0, 3);
        setRelatedArticles(related);
      }
    } catch (error) {
      console.error('Error fetching related articles:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date TBD';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date TBD';
    }
  };

  const copyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleBack = () => {
    navigate('/media/news');
  };

  const handleRelatedClick = (articleId) => {
    navigate(`/media/news/${articleId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareVia = (platform) => {
    const url = window.location.href;
    const text = `Check out this news article: ${article.title}`;
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
          <p className="text-gray-500">Loading news article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">News article not found</h3>
          <p className="text-gray-400">
            {error || "The news article you're looking for doesn't exist or has been removed."}
          </p>
          <button 
            onClick={handleBack}
            className="mt-4 inline-block bg-iphrd-blue-600 text-white px-6 py-2 rounded-lg hover:bg-iphrd-blue-700 transition"
          >
            Back to News
          </button>
        </div>
      </div>
    );
  }

  const isTender = article.category === 'tender';
  const formattedDate = formatDate(article.date_posted);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button 
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-iphrd-blue-600 transition group mb-6"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          Back to News
        </button>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="px-6 md:px-8 lg:px-10 pb-0 pt-6">
            {isTender ? (
              <span className="inline-block bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                TENDER NOTICE
              </span>
            ) : (
              <span className="inline-block bg-iphrd-green text-white text-xs font-medium px-3 py-1 rounded-full">
                NEWS
              </span>
            )}
          </div>

          {article.media_url && (
            <div className="relative mt-4 px-6 md:px-8 lg:px-10">
              {article.media_type === 'image' && (
                <div className="rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={article.media_url} 
                    alt={article.title}
                    className="w-full h-auto max-h-[500px] object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      const fallback = document.createElement('div');
                      fallback.className = 'h-64 flex items-center justify-center bg-gray-100';
                      fallback.innerHTML = `
                        <div class="text-center text-gray-400">
                          <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p class="text-sm">Image not available</p>
                        </div>
                      `;
                      parent.appendChild(fallback);
                    }}
                  />
                </div>
              )}
              {article.media_type === 'video' && (
                <div className="rounded-lg overflow-hidden bg-black">
                  <video 
                    src={article.media_url} 
                    className="w-full max-h-[500px]"
                    controls
                    playsInline
                  />
                </div>
              )}
              {article.media_type === 'pdf' && (
                <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center">
                      <File className="w-8 h-8 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Document</p>
                      <p className="text-sm text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <a
                    href={article.media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-iphrd-green text-white rounded-lg hover:bg-iphrd-green/80 transition flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="p-6 md:p-8 lg:p-10">
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </span>
                {article.author && (
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{article.author}</span>
                  </span>
                )}
                {isTender && (
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="text-orange-600 font-medium">Tender</span>
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{article.title}</h1>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{article.content}</p>
            </div>

            {isTender && article.media_url && article.media_type === 'pdf' && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-orange-800 mb-2 flex items-center gap-2">
                    <File className="w-4 h-4" />
                    Tender Document
                  </h3>
                  <a
                    href={article.media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download Tender Document (PDF)
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap justify-between items-center">
                <div className="text-sm text-gray-400">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Published on {formattedDate}
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

        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <div 
                  key={related.id}
                  onClick={() => handleRelatedClick(related.id)}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden group"
                >
                  {related.media_url && related.media_type === 'image' && (
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={related.media_url}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}
                  {(!related.media_url || related.media_type !== 'image') && (
                    <div className="h-40 bg-gradient-to-br from-iphrd-green/10 to-green-600/10 flex items-center justify-center">
                      {related.category === 'tender' ? (
                        <File className="w-12 h-12 text-orange-400" />
                      ) : (
                        <FileText className="w-12 h-12 text-iphrd-green/40" />
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(related.date_posted)}
                    </div>
                    <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-iphrd-blue-600 transition">
                      {related.title}
                    </h3>
                    <button className="mt-2 text-iphrd-blue-600 text-sm font-medium hover:underline inline-flex items-center gap-1">
                      Read More <span>→</span>
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

export default NewsDetail;