// src/pages/Media/TendersPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, FileText, Download, Eye, X, Gavel } from 'lucide-react';

const TendersPage = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedTender, setSelectedTender] = useState(null);

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://trial.iphrdafrica.org/api/news');
      // Filter only tenders
      const tenderItems = response.data.filter(item => item.category === 'tender');
      setTenders(tenderItems);
    } catch (err) {
      console.error('Error fetching tenders:', err);
      setError('Failed to load tenders.');
    } finally {
      setLoading(false);
    }
  };

  const viewPdf = (tender) => {
    setSelectedTender(tender);
    setSelectedPdf(getFullUrl(tender.media_url));
    setShowPdfModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
    setSelectedPdf(null);
    setSelectedTender(null);
    document.body.style.overflow = 'auto';
  };

  const getFullUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `https://trial.iphrdafrica.org${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iphrd-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tenders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchTenders} className="px-4 py-2 bg-iphrd-green text-white rounded-lg">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* PDF Modal */}
      {showPdfModal && selectedPdf && selectedTender && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">{selectedTender.title}</h2>
              <div className="flex gap-2">
                <a href={selectedPdf} download className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                  <Download className="w-5 h-5" />
                </a>
                <button onClick={closePdfModal} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
              <iframe src={selectedPdf} className="w-full h-full min-h-[70vh] bg-white rounded-lg" title="PDF Preview" />
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-iphrd-green to-green-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-5">
            <span className="text-white text-xs font-medium">Procurement Opportunities</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Tenders</h1>
          <div className="w-20 h-0.5 bg-white mx-auto"></div>
          <p className="text-white/80 text-base max-w-2xl mx-auto mt-4">
            Current tender announcements and procurement opportunities
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {tenders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Gavel className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No tender announcements available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tenders.map((tender) => (
                <div key={tender.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(tender.date_posted).toLocaleDateString()}
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg mb-2">{tender.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{tender.content.substring(0, 150)}...</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewPdf(tender)}
                        className="px-4 py-2 bg-iphrd-green text-white rounded-lg hover:bg-iphrd-green/80 transition inline-flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" /> View Tender
                      </button>
                      <a
                        href={getFullUrl(tender.media_url)}
                        download
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition inline-flex items-center gap-2"
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
    </div>
  );
};

export default TendersPage;