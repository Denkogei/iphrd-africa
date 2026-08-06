// src/pages/Media/PressPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, FileText, Download, Eye, X } from 'lucide-react';

const PressPage = () => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    fetchPressReleases();
  }, []);

  const fetchPressReleases = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://trial.iphrdafrica.org/api/press-releases');
      setReleases(response.data);
    } catch (err) {
      console.error('Error fetching press releases:', err);
      setError('Failed to load press releases.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (release) => {
    setSelectedRelease(release);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRelease(null);
    document.body.style.overflow = 'auto';
  };

  const viewPdf = (url) => {
    setSelectedPdf(url);
    setShowPdfModal(true);
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
    setSelectedPdf(null);
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
          <p className="text-gray-600">Loading press releases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchPressReleases} className="px-4 py-2 bg-iphrd-green text-white rounded-lg">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* PDF Modal */}
      {showPdfModal && selectedPdf && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Document Preview</h2>
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
      <section className="bg-gradient-to-r from-iphrd-green to-green-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Press Releases</h1>
          <div className="w-20 h-0.5 bg-white mx-auto"></div>
          <p className="text-white/80 text-base max-w-2xl mx-auto mt-4">
            Official statements and announcements from IPHRD-Africa
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {releases.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No press releases available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {releases.map((release) => (
                <div key={release.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(release.date_posted).toLocaleDateString()}
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg mb-2">{release.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{release.content.substring(0, 150)}...</p>
                      {release.document_url && (
                        <div className="mt-3 flex gap-3">
                          <button
                            onClick={() => viewPdf(getFullUrl(release.document_url))}
                            className="text-sm text-iphrd-green hover:underline inline-flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" /> View Document
                          </button>
                          <a
                            href={getFullUrl(release.document_url)}
                            download
                            className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                          >
                            <Download className="w-4 h-4" /> Download
                          </a>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => openModal(release)}
                      className="px-4 py-2 text-sm text-iphrd-green border border-iphrd-green rounded-lg hover:bg-iphrd-green hover:text-white transition"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {showModal && selectedRelease && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Press Release</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                <Calendar className="w-4 h-4" />
                {new Date(selectedRelease.date_posted).toLocaleDateString()}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedRelease.title}</h1>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedRelease.content}</p>
              </div>
              {selectedRelease.document_url && (
                <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                  <button
                    onClick={() => viewPdf(getFullUrl(selectedRelease.document_url))}
                    className="px-4 py-2 bg-iphrd-green text-white rounded-lg hover:bg-iphrd-green/80 transition inline-flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> View Document
                  </button>
                  <a
                    href={getFullUrl(selectedRelease.document_url)}
                    download
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PressPage;