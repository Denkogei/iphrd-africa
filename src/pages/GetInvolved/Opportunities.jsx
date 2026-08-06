import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showCVModal, setShowCVModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    cover_letter: "",
    cvFile: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch opportunities from backend
  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      console.log('Fetching opportunities...');
      const response = await axios.get('https://trial.iphrdafrica.org/api/opportunities');
      console.log('Response received:', response.data);
      
      // Ensure we always have an array
      if (response.data && Array.isArray(response.data)) {
        setOpportunities(response.data);
        setError('');
      } else {
        console.error('Invalid response format:', response.data);
        setOpportunities([]);
        setError('Received invalid data format from server');
      }
    } catch (err) {
      console.error('Error fetching opportunities:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please make sure the backend is running on port 5000');
      } else if (err.response) {
        setError(`Server error: ${err.response.status} - ${err.response.data?.error || 'Unknown error'}`);
      } else {
        setError('Failed to load opportunities. Please try again later.');
      }
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        cvFile: e.target.files[0]
      });
    }
  };

  const openCVModal = (job) => {
    setSelectedJob(job);
    setShowCVModal(true);
    setSubmitted(false);
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      cover_letter: "",
      cvFile: null
    });
  };

  const closeModal = () => {
    setShowCVModal(false);
    setSelectedJob(null);
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    if (typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('full_name', formData.full_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone || '');
      formDataToSend.append('cover_letter', formData.cover_letter || '');
      
      if (formData.cvFile) {
        formDataToSend.append('cv', formData.cvFile);
      } else {
        throw new Error('Please upload your CV');
      }
      
      const url = selectedJob 
        ? `https://trial.iphrdafrica.org/api/opportunities/${selectedJob.id}/apply`
        : `https://trial.iphrdafrica.org/api/general-apply`;
      
      const response = await axios.post(url, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data && response.data.success) {
        setSubmitted(true);
        toast.success('Application submitted successfully!');
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        throw new Error(response.data?.error || 'Submission failed');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      toast.error(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iphrd-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading opportunities...</p>
          <p className="text-xs text-gray-400 mt-2"></p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-500 mb-4 font-semibold">{error}</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
            <p className="text-sm text-yellow-800 font-medium mb-2">Troubleshooting:</p>
           
          </div>
          <button 
            onClick={fetchOpportunities} 
            className="px-4 py-2 bg-iphrd-green text-white rounded-lg hover:bg-iphrd-green/80 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Separate open and closed opportunities
  const openOpportunities = opportunities.filter(opp => opp && opp.status === 'Open');
  const closedOpportunities = opportunities.filter(opp => opp && opp.status === 'Closed');

  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-iphrd-green to-green-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-5">
            <span className="text-white text-xs font-medium">Join Our Team</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Opportunities</h1>
          <div className="w-20 h-0.5 bg-white mx-auto"></div>
          <p className="text-white/80 text-base max-w-2xl mx-auto mt-4">
            Join us in building a better Africa through peace, human rights, and sustainable development
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column - Opportunities List */}
            <div className="lg:col-span-2">
              {opportunities.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <p className="text-gray-500">No current opportunities available. Please check back later.</p>
                  <button 
                    onClick={fetchOpportunities}
                    className="mt-4 text-iphrd-green hover:underline text-sm"
                  >
                    Refresh
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Open Opportunities Section */}
                  {openOpportunities.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-gray-900">Open Positions ({openOpportunities.length})</h2>
                      </div>
                      {openOpportunities.map((opp) => (
                        <div key={opp.id} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900">{opp.title || 'Untitled'}</h3>
                              <p className="text-iphrd-green text-sm mt-1 font-medium">{opp.type || 'N/A'}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white shadow-sm flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                              Open
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {truncateText(opp.description, 120)}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                            <span className="flex items-center gap-1">📍 {opp.location || 'TBD'}</span>
                            <span className="flex items-center gap-1">⏰ Deadline: {opp.deadline || 'Not specified'}</span>
                            <span className="flex items-center gap-1">📅 Posted: {opp.date_posted ? new Date(opp.date_posted).toLocaleDateString() : 'Recently'}</span>
                          </div>
                          
                          <div className="flex gap-3">
                            <Link 
                              to={`/opportunities/${opp.id}`}
                              className="px-6 py-2.5 border border-iphrd-green text-iphrd-green rounded-lg hover:bg-iphrd-green hover:text-white transition inline-flex items-center gap-2 font-medium"
                            >
                              View Details
                              <span>→</span>
                            </Link>
                            <button 
                              onClick={() => openCVModal(opp)}
                              className="bg-iphrd-green text-white px-6 py-2.5 rounded-lg hover:bg-iphrd-green/80 transition inline-flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
                            >
                              Apply Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Closed Opportunities Section */}
                  {closedOpportunities.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 mb-4 mt-8">
                        <div className="w-2 h-6 bg-red-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-gray-900">Closed Positions ({closedOpportunities.length})</h2>
                      </div>
                      {closedOpportunities.map((opp) => (
                        <div key={opp.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 opacity-75">
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-700">{opp.title || 'Untitled'}</h3>
                              <p className="text-gray-500 text-sm mt-1 font-medium">{opp.type || 'N/A'}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-400 text-white shadow-sm flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                              Closed
                            </span>
                          </div>
                          
                          <p className="text-gray-500 mb-4 leading-relaxed">
                            {truncateText(opp.description, 120)}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4 pb-4 border-b border-gray-200">
                            <span className="flex items-center gap-1">📍 {opp.location || 'TBD'}</span>
                            <span className="flex items-center gap-1">⏰ Deadline: {opp.deadline || 'Not specified'}</span>
                            <span className="flex items-center gap-1">📅 Posted: {opp.date_posted ? new Date(opp.date_posted).toLocaleDateString() : 'Recently'}</span>
                          </div>
                          
                          <Link 
                            to={`/opportunities/${opp.id}`}
                            className="px-6 py-2.5 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100 transition inline-flex items-center gap-2 font-medium"
                          >
                            View Details
                            <span>→</span>
                          </Link>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 sticky top-24 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Why Join Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-iphrd-green text-lg">✓</span>
                    <span className="text-gray-600 text-sm">Make a meaningful impact in communities across Africa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-iphrd-green text-lg">✓</span>
                    <span className="text-gray-600 text-sm">Work with diverse communities and stakeholders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-iphrd-green text-lg">✓</span>
                    <span className="text-gray-600 text-sm">Professional development and growth opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-iphrd-green text-lg">✓</span>
                    <span className="text-gray-600 text-sm">Network with peace-building professionals worldwide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-iphrd-green text-lg">✓</span>
                    <span className="text-gray-600 text-sm">Be part of a mission-driven organization</span>
                  </li>
                </ul>
                <hr className="my-5 border-gray-200" />
                <p className="text-sm text-gray-600 mb-3 text-center">Don't see a suitable opportunity?</p>
                <button 
                  onClick={() => openCVModal(null)}
                  className="w-full bg-iphrd-green text-white px-4 py-2.5 rounded-lg hover:bg-iphrd-green/80 transition font-medium text-sm shadow-sm"
                >
                  Submit Your CV
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CV Submission Modal */}
      {showCVModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedJob ? `Apply for: ${selectedJob.title}` : "Submit Your CV"}
                </h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-iphrd-green text-5xl mb-4">✓</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Submitted!</h3>
                  <p className="text-gray-600">Thank you for your interest. We'll review your application and get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                    <textarea
                      name="cover_letter"
                      rows="4"
                      value={formData.cover_letter}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                      placeholder="Tell us why you're interested in this position..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload CV (PDF only) *</label>
                    <input
                      type="file"
                      name="cvFile"
                      required
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                    />
                    <p className="text-xs text-gray-500 mt-1">Max file size: 5MB. Accepted formats: PDF</p>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-iphrd-green text-white px-6 py-2.5 rounded-lg hover:bg-iphrd-green/80 transition font-medium disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Back to Home */}
      <div className="bg-white pb-12 text-center">
        <Link to="/" className="text-iphrd-green hover:text-iphrd-green/80 text-sm transition inline-flex items-center gap-1">
          <span>←</span>
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default Opportunities;