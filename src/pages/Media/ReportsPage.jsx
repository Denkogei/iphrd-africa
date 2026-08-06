// src/pages/Media/ReportsPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, FileText, Download, Eye, X, Search, Filter, TrendingUp, BookOpen, File, ChevronDown } from 'lucide-react';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterAndSortReports();
  }, [reports, searchTerm, selectedYear, sortBy]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://trial.iphrdafrica.org/api/reports');
      setReports(response.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortReports = () => {
    let filtered = [...reports];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(report => report.year === parseInt(selectedYear));
    }

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date_posted) - new Date(b.date_posted));
    } else if (sortBy === 'year_desc') {
      filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
    } else if (sortBy === 'year_asc') {
      filtered.sort((a, b) => (a.year || 0) - (b.year || 0));
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredReports(filtered);
  };

  const viewPdf = (report) => {
    setSelectedReport(report);
    setSelectedPdf(getFullUrl(report.file_url));
    setShowPdfModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
    setSelectedPdf(null);
    setSelectedReport(null);
    document.body.style.overflow = 'auto';
  };

  const getFullUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `https://trial.iphrdafrica.org${url}`;
  };

  // Get unique years for filter
  const availableYears = ['all', ...new Set(reports.map(r => r.year).filter(Boolean))].sort((a, b) => b - a);

  // Stats
  const stats = {
    total: reports.length,
    thisYear: reports.filter(r => r.year === new Date().getFullYear()).length,
    oldestYear: Math.min(...reports.map(r => r.year).filter(Boolean)),
    newestYear: Math.max(...reports.map(r => r.year).filter(Boolean))
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iphrd-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchReports} className="px-6 py-2 bg-iphrd-green text-white rounded-lg hover:bg-iphrd-green/80 transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* PDF Modal */}
      {showPdfModal && selectedPdf && selectedReport && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-iphrd-green to-green-600">
              <div>
                <h2 className="text-lg font-semibold text-white">{selectedReport.title}</h2>
                <p className="text-white/70 text-sm mt-0.5">{selectedReport.year && `Published in ${selectedReport.year}`}</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={selectedPdf}
                  download
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition text-white"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </a>
                <button
                  onClick={closePdfModal}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
              <iframe
                src={selectedPdf}
                className="w-full h-full min-h-[70vh] bg-white rounded-lg shadow-inner"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-iphrd-green to-green-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-5">
            <span className="text-white text-xs font-medium">Knowledge Hub</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Publications & Reports</h1>
          <div className="w-20 h-0.5 bg-white mx-auto"></div>
          <p className="text-white/80 text-base max-w-2xl mx-auto mt-4">
            Research publications, annual reports, and key documentation from IPHRD-Africa
          </p>
        </div>
      </section>

      {/* Stats Section */}
      {reports.length > 0 && (
        <section className="py-12 bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-iphrd-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-iphrd-green" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                <p className="text-xs text-gray-500">Total Reports</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-iphrd-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-iphrd-green" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.thisYear}</p>
                <p className="text-xs text-gray-500">Published This Year</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-iphrd-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-iphrd-green" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.newestYear || 'N/A'}</p>
                <p className="text-xs text-gray-500">Latest Year</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-iphrd-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-iphrd-green" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.oldestYear || 'N/A'}</p>
                <p className="text-xs text-gray-500">Since Year</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-8 shadow-sm">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                />
              </div>

              {/* Year Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-iphrd-green appearance-none bg-white"
                >
                  <option value="all">All Years</option>
                  {availableYears.filter(y => y !== 'all').map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort By */}
              <div className="relative">
                <File className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-iphrd-green appearance-none bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="year_desc">Year (High to Low)</option>
                  <option value="year_asc">Year (Low to High)</option>
                  <option value="title">Title A-Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-700">{filteredReports.length}</span> of{' '}
              <span className="font-semibold text-gray-700">{reports.length}</span> reports
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm text-iphrd-green hover:underline"
              >
                Clear search
              </button>
            )}
          </div>

          {/* Reports Grid */}
          {filteredReports.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No reports found matching your criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedYear('all');
                  setSortBy('newest');
                }}
                className="mt-4 text-iphrd-green hover:underline text-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                          <File className="w-4 h-4 text-red-500" />
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(report.date_posted).toLocaleDateString()}
                        </span>
                      </div>
                      {report.year && (
                        <span className="text-xs bg-iphrd-green/10 text-iphrd-green px-2 py-1 rounded-full font-medium">
                          {report.year}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 group-hover:text-iphrd-green transition">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {report.description}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewPdf(report)}
                        className="flex-1 px-4 py-2.5 bg-iphrd-green text-white rounded-lg hover:bg-iphrd-green/80 transition flex items-center justify-center gap-2 text-sm font-medium group/btn"
                      >
                        <Eye className="w-4 h-4 group-hover/btn:scale-110 transition" />
                        View Report
                      </button>
                      <a
                        href={getFullUrl(report.file_url)}
                        download
                        className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 text-sm"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer Note */}
      {reports.length > 0 && (
        <div className="bg-gray-50 border-t border-gray-100 py-8 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs text-gray-500">
              All reports are available for download. For older publications or specific inquiries,
              please contact us at <a href="mailto:info@iphrdafrica.org" className="text-iphrd-green hover:underline">info@iphrdafrica.org</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;