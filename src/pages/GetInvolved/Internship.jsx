// src/pages/GetInvolved/Internship.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  GraduationCap, MapPin, Clock, CheckCircle,
  Globe, Users, Heart, Mail, Info
} from 'lucide-react';

const Internship = () => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    cover_letter: '',
    cvFile: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const openApplyModal = () => {
    setShowApplyModal(true);
    setSubmitted(false);
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      cover_letter: '',
      cvFile: null
    });
  };

  const closeModal = () => {
    setShowApplyModal(false);
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
      
      // Use general-apply endpoint which sets application_type='internship'
      const url = 'https://trial.iphrdafrica.org/api/general-apply';
      
      const response = await axios.post(url, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        setSubmitted(true);
        toast.success('Internship application submitted successfully!');
        setTimeout(() => {
          closeModal();
        }, 2000);
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      toast.error(err.response?.data?.error || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-iphrd-green to-green-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-5">
            <span className="text-white text-xs font-medium">Join Our Team</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">INTERNSHIPS / PLACEMENTS</h1>
          <div className="w-20 h-0.5 bg-white mx-auto"></div>
          <p className="text-white/80 text-base max-w-2xl mx-auto mt-4">
            Gain hands-on experience in peace-building, human rights, and development while making a real impact in communities across Africa
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <p className="text-gray-700 leading-relaxed mb-6">
              IPHRD-Africa internship programme is born out of the realization that internship is a significant way in which new and youthful talent are brought on board while enabling the interns (often students or graduates) to meet their short term needs and assistance in the career learning process.
            </p>
            
            <h2 className="text-xl font-bold text-gray-800 mb-4">The IPRHD-Africa Internship Programme is designed to achieve the following objectives:</h2>
            
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-iphrd-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-iphrd-green">1</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  To expose interns to the work of IPHRD-Africa thereby giving them an in-depth understanding of the IPHRD-Africa mandate, objectives, opportunities and the challenges and; further to enable them gain practical knowledge of the IPHRD-Africa inner workings.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-iphrd-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-iphrd-green">2</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  To provide a framework by which students from diverse academic backgrounds are assigned to the IPHRD-Africa where their educational experience can be enhanced through practical assignments thus giving them practical work and educational experience in the unique environment of the IPHRD-Africa.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-iphrd-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-iphrd-green">3</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  To provide the IPHRD-Africa with the assistance of qualified students who have specialized in various research and academic disciplines related to different aspects of Peace, Human rights and Development, hence affording it the services of highly qualified people to assist in programmes work thereby contributing substantively to the work of IPHRD-Africa.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-iphrd-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-iphrd-green">4</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  To create active supporters and advocates of Peace, Human Rights and Development.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column - Internship Info */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-100 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Internship Opportunities</h2>
                <p className="text-gray-600 mb-6">
                  IPHRD-Africa offers internship opportunities in various fields including:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-iphrd-green" />
                    <span className="text-gray-700">Peace-building & Conflict Resolution</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-iphrd-green" />
                    <span className="text-gray-700">Human Rights Advocacy</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-iphrd-green" />
                    <span className="text-gray-700">Communications & Media</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-iphrd-green" />
                    <span className="text-gray-700">Research & Policy Analysis</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-iphrd-green" />
                    <span className="text-gray-700">Program Management</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-iphrd-green" />
                    <span className="text-gray-700">Monitoring & Evaluation</span>
                  </div>
                </div>
                
                <div className="bg-iphrd-green/5 rounded-lg p-4 mt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">What We Offer:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-iphrd-green mt-0.5" />
                      <span className="text-sm text-gray-600">Hands-on experience in real projects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-iphrd-green mt-0.5" />
                      <span className="text-sm text-gray-600">Mentorship from experienced professionals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-iphrd-green mt-0.5" />
                      <span className="text-sm text-gray-600">Networking opportunities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-iphrd-green mt-0.5" />
                      <span className="text-sm text-gray-600">Certificate of completion</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              {/* Important Information */}
              <div className="bg-gradient-to-br from-iphrd-green/5 to-green-600/5 rounded-xl p-6 mb-6 border border-iphrd-green/10">
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-6 h-6 text-iphrd-green" />
                  <h3 className="text-lg font-bold text-gray-800">Important Information</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <strong>Duration:</strong> 3-6 months (flexible arrangements available)
                    </p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <strong>Compensation:</strong> Unpaid internship (voluntary position)
                    </p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <strong>Location:</strong> Nairobi, Kenya (Hybrid options available)
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Program Highlights</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-iphrd-green/10 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-iphrd-green" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">50+ Interns Trained</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-iphrd-green/10 rounded-full flex items-center justify-center">
                      <Globe className="w-4 h-4 text-iphrd-green" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">15+ African Countries</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-iphrd-green/10 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-iphrd-green" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">100% Mentorship Support</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* How to Apply */}
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">How to Apply</h3>
                <p className="text-sm text-gray-600 mb-4">Submit your application including:</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-gray-600">1</span>
                    </div>
                    <span className="text-sm text-gray-600">Updated CV/Resume</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-gray-600">2</span>
                    </div>
                    <span className="text-sm text-gray-600">Cover letter stating your interest</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-gray-600">3</span>
                    </div>
                    <span className="text-sm text-gray-600">Academic transcripts or certificates</span>
                  </li>
                </ul>
                
                <button
                  onClick={openApplyModal}
                  className="w-full bg-iphrd-green text-white py-2.5 rounded-lg hover:bg-iphrd-green/80 transition font-medium text-sm flex items-center justify-center gap-2"
                >
                  Apply Now
                  <span>→</span>
                </button>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-iphrd-green" />
                    <p className="text-sm font-medium text-gray-700">For inquiries:</p>
                  </div>
                  <a href="mailto:info@iphrdafrica.org" className="text-sm text-iphrd-green hover:underline">
                    info@iphrdafrica.org
                  </a>
                </div>
                
                <div className="pt-4">
                  <p className="text-xs text-gray-500 text-center">
                    Applications are reviewed on a rolling basis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Apply for Internship
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter *</label>
                    <textarea
                      name="cover_letter"
                      rows="6"
                      required
                      value={formData.cover_letter}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                      placeholder="Tell us why you're interested in this internship and how your skills align with our mission..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload CV/Resume (PDF Only) *</label>
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

export default Internship;