// src/pages/GetInvolved/JobDetails.jsx
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCVModal, setShowCVModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    cover_letter: "",
    cvFile: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://trial.iphrdafrica.org/api/opportunities/${id}`);
      setJob(response.data);
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Failed to load job details. Please try again later.');
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
    setFormData({
      ...formData,
      cvFile: e.target.files[0]
    });
  };

  const openCVModal = () => {
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
      formDataToSend.append('cv', formData.cvFile);
      
      const url = `https://trial.iphrdafrica.org/api/opportunities/${job.id}/apply`;
      
      const response = await axios.post(url, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        setSubmitted(true);
        toast.success('Application submitted successfully!');
        setTimeout(() => {
          closeModal();
          navigate('/opportunities');
        }, 2000);
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      toast.error(err.response?.data?.error || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Function to parse the description and extract sections
  const parseDescription = (description) => {
    if (!description) return { jobDescription: '', requirements: '', responsibilities: '' };
    
    let jobDescription = description;
    let requirements = '';
    let responsibilities = '';
    
    // Try to extract sections based on common patterns
    const requirementsPattern = /(?:requirements|qualifications|required skills)[:\s]*([\s\S]*?)(?=(?:responsibilities|duties|what you'll do|$))/i;
    const responsibilitiesPattern = /(?:responsibilities|duties|what you'll do|key responsibilities)[:\s]*([\s\S]*?)(?=(?:requirements|qualifications|$))/i;
    
    const requirementsMatch = description.match(requirementsPattern);
    const responsibilitiesMatch = description.match(responsibilitiesPattern);
    
    if (requirementsMatch) {
      requirements = requirementsMatch[1].trim();
      jobDescription = jobDescription.replace(requirementsMatch[0], '').trim();
    }
    
    if (responsibilitiesMatch) {
      responsibilities = responsibilitiesMatch[1].trim();
      jobDescription = jobDescription.replace(responsibilitiesMatch[0], '').trim();
    }
    
    // Clean up extra newlines
    jobDescription = jobDescription.replace(/\n{3,}/g, '\n\n').trim();
    
    return { jobDescription, requirements, responsibilities };
  };

  // Function to format text with bullet points
  const formatText = (text) => {
    if (!text) return '';
    // Check if text contains bullet points (lines starting with •, -, *, or numbers)
    if (text.match(/^[•\-*\d+.]/m)) {
      return text;
    }
    return text;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iphrd-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Job not found'}</p>
          <Link to="/opportunities" className="px-4 py-2 bg-iphrd-green text-white rounded-lg">
            Back to Opportunities
          </Link>
        </div>
      </div>
    );
  }

  const { jobDescription, requirements, responsibilities } = parseDescription(job.description);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-iphrd-green to-green-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/opportunities" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition">
            <span className="text-xl mr-1">←</span>
            Back to Opportunities
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{job.title}</h1>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              job.status === 'Open' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-500 text-white'
            }`}>
              {job.status}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-iphrd-blue text-white">
              {job.type}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Job Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📍</span>
                <h3 className="font-semibold text-gray-700">Location</h3>
              </div>
              <p className="text-gray-600">{job.location}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⏰</span>
                <h3 className="font-semibold text-gray-700">Deadline</h3>
              </div>
              <p className="text-gray-600">{job.deadline}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📅</span>
                <h3 className="font-semibold text-gray-700">Posted Date</h3>
              </div>
              <p className="text-gray-600">{new Date(job.date_posted).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Job Description */}
          {jobDescription && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {jobDescription}
                </p>
              </div>
            </div>
          )}

          {/* Requirements */}
          {requirements && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
              <div className="prose max-w-none">
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {formatText(requirements).split('\n').map((line, index) => (
                    <p key={index} className={line.trim().startsWith('•') ? 'ml-4' : ''}>
                      {line.trim()}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {responsibilities && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsibilities</h2>
              <div className="prose max-w-none">
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {formatText(responsibilities).split('\n').map((line, index) => (
                    <p key={index} className={line.trim().startsWith('•') ? 'ml-4' : ''}>
                      {line.trim()}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* If no sections were parsed, show the full description */}
          {!requirements && !responsibilities && job.description && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {job.description}
                </p>
              </div>
            </div>
          )}

          {/* Application Button */}
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            {job.status === 'Open' ? (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Apply?</h3>
                <p className="text-gray-600 mb-4">Join us in making a difference</p>
                <button
                  onClick={openCVModal}
                  className="bg-iphrd-green text-white px-8 py-3 rounded-lg hover:bg-iphrd-green/80 transition font-medium inline-flex items-center gap-2"
                >
                  Apply Now
                  <span>→</span>
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Application Closed</h3>
                <p className="text-gray-600">This position is no longer accepting applications</p>
              </>
            )}
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
                  Apply for: {job.title}
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
    </div>
  );
};

export default JobDetails;